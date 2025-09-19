import { Module } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'certificate-issuance',
    }),
  ],
  controllers: [CertificatesController],
  providers: [CertificatesService], // <-- تم حذف PrismaService من هنا
})
export class CertificatesModule {}
