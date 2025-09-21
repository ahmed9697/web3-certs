import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IssueCertificateDto } from './dto/issue-certificate.dto';
// import { BullQueueService } from '../bull/bull.service'; //  <--  تم تعطيله مؤقتًا

@Injectable()
export class CertificatesService {
  constructor(
    private readonly prisma: PrismaService,
    // private readonly bullQueueService: BullQueueService, //  <--  تم تعطيله مؤقتًا
  ) {}

  //  تم تعديل الدالة لتقبل userId
  async issueCertificate(
    issueCertificateDto: IssueCertificateDto,
    userId: number,
  ) {
    const certificate = await this.prisma.certificate.create({
      data: {
        ...issueCertificateDto,
        issuerId: userId, //  <--  تمت إضافة issuerId هنا
      },
    });
    // await this.bullQueueService.addCertificateJob(certificate); //  <--  تم تعطيله مؤقتًا
    return certificate;
  }

  async findAll(options: { page: number; limit: number }) {
    const { page, limit } = options;
    const skip = (page - 1) * limit;
    return this.prisma.certificate.findMany({
      skip,
      take: limit,
      include: {
        issuer: {
          select: { email: true }, //  لإظهار بريد المصدر الإلكتروني
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.certificate.findUnique({
      where: { id },
      include: {
        issuer: {
          select: { email: true },
        },
      },
    });
  }
}