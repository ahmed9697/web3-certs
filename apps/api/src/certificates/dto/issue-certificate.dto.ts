import { IsString, IsEmail, IsDateString, MinLength } from 'class-validator';

export class IssueCertificateDto {
  @IsString()
  @MinLength(2)
  studentName: string;

  @IsEmail()
  studentEmail: string;

  @IsString()
  @MinLength(2)
  degreeName: string;

  @IsString()
  @MinLength(2)
  degreeSubject: string;

  @IsDateString()
  issueDate: Date;
}
