import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // <-- Import Passport
import { JwtStrategy } from './strategies/jwt.strategy'; // <-- Import Strategy

@Module({
  imports: [
    PassportModule, // <-- Add PassportModule
    JwtModule.register({
      global: true,
      secret: 'your-super-secret-key-that-is-at-least-32-chars-long',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy], // <-- Add JwtStrategy
})
export class AuthModule {}
