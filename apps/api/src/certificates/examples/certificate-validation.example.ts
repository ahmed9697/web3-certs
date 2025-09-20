// Example file showing how to use validation without decorators
import { IssueCertificateDto } from '../dto/issue-certificate.dto';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { issueCertificateSchema } from '../dto/issue-certificate.schema';
import { ValidationPipe } from '../../common/pipes/validation.pipe';

/**
 * Example functions demonstrating different validation approaches
 * This is for demonstration purposes only and not meant to be used in production
 */

/**
 * Example using the custom schema validation approach
 */
export function validateWithSchema(requestBody: any): { valid: boolean; data?: IssueCertificateDto; errors?: string[] } {
  try {
    const joiValidator = new JoiValidationPipe(issueCertificateSchema);
    const validatedDto = joiValidator.transform(requestBody, { type: 'body', metatype: IssueCertificateDto });
    
    return {
      valid: true,
      data: validatedDto as IssueCertificateDto
    };
  } catch (error) {
    return {
      valid: false,
      errors: error.response?.errors || [error.message]
    };
  }
}

/**
 * Example using the custom validation pipe
 */
export async function validateWithPipe(requestBody: any): Promise<{ valid: boolean; data?: IssueCertificateDto; errors?: string[] }> {
  try {
    const validationPipe = new ValidationPipe();
    const validatedDto = await validationPipe.transform(requestBody, { type: 'body', metatype: IssueCertificateDto });
    
    return {
      valid: true,
      data: validatedDto as IssueCertificateDto
    };
  } catch (error) {
    return {
      valid: false,
      errors: error.response?.errors || [error.message]
    };
  }
}

/**
 * Example usage
 */
export function exampleUsage() {
  const requestBody = {
    studentName: 'Ahmed Aboessa',
    studentEmail: 'ahmed.aboessa@example.com',
    degreeName: 'Master of Computer Science',
    degreeSubject: 'Computer Science',
    issueDate: '2025-09-15'
  };
  
  // Using schema validation
  const schemaResult = validateWithSchema(requestBody);
  console.log('Schema validation result:', schemaResult);
  
  // Using pipe validation
  validateWithPipe(requestBody).then(pipeResult => {
    console.log('Pipe validation result:', pipeResult);
  });
}