import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsDateString } from 'class-validator';

export class IssueCertificateDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  studentName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  studentEmail: string;

  @ApiProperty({ example: 'Master of Science' })
  @IsString()
  @IsNotEmpty()
  degreeName: string;

  @ApiProperty({ example: 'Computer Science' })
  @IsString()
  @IsNotEmpty()
  degreeSubject: string;

  @ApiProperty({ example: '2025-09-15' })
  @IsDateString()
  issueDate: Date;
}
