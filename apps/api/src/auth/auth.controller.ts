import { Controller, Post, Body, Res, Get, Request, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.register(registerUserDto);
    this.authService.setTokenCookies(response, tokens);
    return { message: 'Registration successful' };
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.login(loginUserDto);
    this.authService.setTokenCookies(response, tokens);
    return { message: 'Login successful' };
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshToken(
    @Request() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userId = req.user.sub;
    const refreshToken = req.cookies.refresh_token;
    const tokens = await this.authService.refreshToken(userId, refreshToken);
    this.authService.setTokenCookies(response, tokens);
    return { message: 'Token refreshed' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // req.user is populated by JwtAuthGuard
    return this.authService.getProfile(req.user.userId);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    this.authService.clearTokenCookies(response);
    return { message: 'Logout successful' };
  }
}
