// Remove decorators to fix TypeScript 5.9 compatibility issues
// Validation will be handled by ValidationPipe in the controller

export class IssueCertificateDto {
  /**
   * Student's full name
   * @example 'Ahmed Aboessa'
   */
  studentName: string;

  /**
   * Student's email address
   * @example 'ahmed.aboessa@example.com'
   */
  studentEmail: string;

  /**
   * Name of the degree
   * @example 'Master of Computer Science'
   */
  degreeName: string;

  /**
   * Subject of the degree
   * @example 'Computer Science'
   */
  degreeSubject: string;

  /**
   * Date when the certificate is issued
   * @example '2025-09-15'
   */
  issueDate: Date;
}
