import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-super-secret-key-that-is-at-least-32-chars-long', // Use same secret as in auth.module
    });
  }

  // The 'async' keyword has been removed from this function
  validate(payload: { sub: number; email: string }) {
    // Passport attaches this to the request object as req.user
    return { userId: payload.sub, email: payload.email };
  }
}
