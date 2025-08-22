import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterUserDto): Promise<Tokens> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: passwordHash,
      },
    });

    return this.generateTokens(user.id, user.email);
  }

  async login(dto: LoginUserDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return this.generateTokens(user.id, user.email);
  }

  async refreshToken(userId: string, rt: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    // In a real-world scenario, you would also check if the refresh token is valid
    // (e.g., stored in the DB and not revoked). For simplicity, we omit that here.

    return this.generateTokens(user.id, user.email);
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, createdAt: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // --- Token and Cookie Helpers ---

  private async generateTokens(userId: string, email: string): Promise<Tokens> {
    const payload = { sub: userId, email };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'), // Use a different secret for refresh tokens
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  setTokenCookies(response: Response, tokens: Tokens) {
    response.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    response.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/app/api/auth', // Only send to refresh endpoint
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  clearTokenCookies(response: Response) {
    response.clearCookie('access_token', { path: '/' });
    response.clearCookie('refresh_token', { path: '/app/api/auth' });
  }
}
