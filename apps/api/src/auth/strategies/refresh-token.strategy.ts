import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.refresh_token,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      // We need the request object in the validate method to access the refresh token itself
      passReqToCallback: true,
    });
  }

  // The payload is what we signed into the token
  // The req object is passed because of `passReqToCallback: true`
  validate(req: Request, payload: { sub: string; email: string }) {
    const refreshToken = req.cookies.refresh_token;
    // We can add more validation here, e.g., check against a token whitelist in DB.
    // The returned object will be attached to req.user
    return { ...payload, refreshToken };
  }
}
