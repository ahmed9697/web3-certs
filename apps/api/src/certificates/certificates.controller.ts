import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Get, // <-- Add 'Get' to imports
} from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { IssueCertificateDto } from './dto/issue-certificate.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiProperty } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger/dist/decorators/api-bearer-auth.decorator';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { ApiResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-tags.decorator';
import type { ApiOperationOptions } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import type { ApiResponseOptions } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { UserPayload } from '../auth/interfaces/user-payload.interface';
import { Certificate } from '@prisma/client';

@ApiTags('Certificates')
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post('issue')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Issue a new certificate' } as ApiOperationOptions)
  @ApiResponse({
    status: 201,
    description: 'Certificate issuance process started.',
  } as ApiResponseOptions)
  @ApiResponse({ status: 401, description: 'Unauthorized.' } as ApiResponseOptions)
  create(
    @Body() issueCertificateDto: IssueCertificateDto,
    @GetUser() user: UserPayload,
  ): Promise<Certificate> {
    return this.certificatesService.create(issueCertificateDto, user.userId);
  }

  @Patch(':id/finalize')
  @ApiOperation({ summary: 'Finalize a certificate (internal use by agent)' } as ApiOperationOptions)
  update(
    @Param('id') id: string,
    @Body() updateData: { ipfsCID: string; transactionHash: string },
  ): Promise<Certificate> {
    return this.certificatesService.finalize(
      +id,
      updateData.ipfsCID,
      updateData.transactionHash,
    );
  }

  // --- NEW ENDPOINT 1 (for the admin dashboard) ---
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Find all certificates issued by the logged-in user',
  } as ApiOperationOptions)
  findAll(@GetUser() user: UserPayload): Promise<Certificate[]> {
    return this.certificatesService.findAllForUser(user.userId);
  }

  // --- NEW ENDPOINT 2 (for the public verification page) ---
  @Get('public/:id')
  @ApiOperation({
    summary: 'Find a single certificate for public verification',
  } as ApiOperationOptions)
  findOnePublic(@Param('id') id: string): Promise<Certificate | null> {
    return this.certificatesService.findOnePublic(+id);
  }
}
