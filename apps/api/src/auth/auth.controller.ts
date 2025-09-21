import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  // تم تغيير اسم الدالة هنا لـ signIn
  signIn(@Body() authDto: AuthDto) {
    // وتم تغيير الاستدعاء هنا لـ signIn
    return this.authService.signIn(authDto);
  }

  @Post('register')
  // تم تغيير اسم الدالة هنا لـ signUp
  signUp(@Body() authDto: AuthDto) {
    // وتم تغيير الاستدعاء هنا لـ signUp
    return this.authService.signUp(authDto);
  }
}