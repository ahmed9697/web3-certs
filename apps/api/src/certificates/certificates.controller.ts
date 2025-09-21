import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  NotFoundException,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { IssueCertificateDto } from './dto/issue-certificate.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiBearerAuth,
// } from '@nestjs/swagger'; // <-- تعطيل
import {
  JoiValidationPipe,
  issueCertificateSchema,
} from './dto/issue-certificate.schema';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { UserPayload } from '../auth/interfaces/user-payload.interface';

// @ApiTags('certificates') // <-- تعطيل
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post('issue')
  @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth() // <-- تعطيل
  // @ApiOperation({ summary: 'Issue a new certificate' }) // <-- تعطيل
  // @ApiResponse({ status: 201, description: 'The certificate has been successfully issued.' }) // <-- تعطيل
  // @ApiResponse({ status: 400, description: 'Bad Request.' }) // <-- تعطيل
  // @ApiResponse({ status: 401, description: 'Unauthorized.' }) // <-- تعطيل
  async issueCertificate(
    @Body(new JoiValidationPipe(issueCertificateSchema))
    issueCertificateDto: IssueCertificateDto,
    @GetUser() user: UserPayload,
  ) {
    return this.certificatesService.issueCertificate(
      issueCertificateDto,
      user.userId,
    );
  }

  @Get()
  // @ApiOperation({ summary: 'Get all certificates' }) // <-- تعطيل
  // @ApiResponse({ status: 200, description: 'Return all certificates.' }) // <-- تعطيل
  async findAll(@Query('page') page = '1', @Query('limit') limit = '10') {
    return this.certificatesService.findAll({
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get(':id')
  // @ApiOperation({ summary: 'Get a certificate by ID' }) // <-- تعطيل
  // @ApiResponse({ status: 200, description: 'Return the certificate.' }) // <-- تعطيل
  // @ApiResponse({ status: 404, description: 'Certificate not found.' }) // <-- تعطيل
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const certificate = await this.certificatesService.findOne(id);
    if (!certificate) {
      throw new NotFoundException(`Certificate with ID ${id} not found`);
    }
    return certificate;
  }
}