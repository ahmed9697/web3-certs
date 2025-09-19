import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BullModule } from '@nestjs/bullmq';
import { CertificatesModule } from './certificates/certificates.module';
import { PrismaModule } from './prisma/prisma.module'; // <-- استيراد الوحدة الجديدة

@Module({
  imports: [
    AuthModule,
    BullModule.forRoot({
      connection: {
        host: '127.0.0.1',
        port: 6379,
      },
    }),
    CertificatesModule, // <-- Add this line
    PrismaModule, // <-- إضافة الوحدة هنا
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
