import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Certificate } from '@prisma/client';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { IssueCertificateDto } from './dto/issue-certificate.dto';

@Injectable()
export class CertificatesService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('certificate-issuance') private certificateQueue: Queue,
  ) {}

  async create(
    issueCertificateDto: IssueCertificateDto,
    issuerId: number,
  ): Promise<Certificate> {
    const certificate = await this.prisma.certificate.create({
      data: {
        ...issueCertificateDto, // <-- THE FIX IS HERE
        issueDate: new Date(issueCertificateDto.issueDate),
        issuerId: issuerId,
        status: 'PENDING',
      },
    });

    await this.certificateQueue.add('issue-certificate-job', certificate, {
      priority: 1,
    });

    return certificate;
  }

  async finalize(
    id: number,
    ipfsCID: string,
    transactionHash: string,
  ): Promise<Certificate> {
    return this.prisma.certificate.update({
      where: { id: id },
      data: {
        status: 'ISSUED',
        ipfsCID: ipfsCID,
        transactionHash: transactionHash,
      },
    });
  }

  async findAllForUser(issuerId: number): Promise<Certificate[]> {
    return this.prisma.certificate.findMany({
      where: { issuerId: issuerId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOnePublic(id: number): Promise<Certificate | null> {
    return this.prisma.certificate.findUnique({
      where: { id: id },
    });
  }
}
