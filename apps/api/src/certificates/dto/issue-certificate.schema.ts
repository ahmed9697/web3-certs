import { IssueCertificateDto } from './issue-certificate.dto';
// We'll use a schema validation approach that doesn't rely on direct Joi imports
// to avoid TypeScript errors with the current project setup

import { ValidationSchema } from '../../common/pipes/joi-validation.pipe';

/**
 * Custom schema validator for IssueCertificateDto
 */
class IssueCertificateSchema implements ValidationSchema {
  validate(value: any, options?: any) {
    const errors: Array<{ property: string; message: string }> = [];
    const result = { ...value };
    
    // Validate and trim studentName
    if (!result.studentName) {
      errors.push({ property: 'studentName', message: 'Student name is required' });
    } else if (typeof result.studentName !== 'string') {
      errors.push({ property: 'studentName', message: 'Student name must be a string' });
    } else {
      result.studentName = result.studentName.trim();
    }
    
    // Validate and trim studentEmail
    if (!result.studentEmail) {
      errors.push({ property: 'studentEmail', message: 'Student email is required' });
    } else if (typeof result.studentEmail !== 'string') {
      errors.push({ property: 'studentEmail', message: 'Student email must be a string' });
    } else {
      result.studentEmail = result.studentEmail.trim();
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(result.studentEmail)) {
        errors.push({ property: 'studentEmail', message: 'Invalid email format' });
      }
    }
    
    // Validate and trim degreeName
    if (!result.degreeName) {
      errors.push({ property: 'degreeName', message: 'Degree name is required' });
    } else if (typeof result.degreeName !== 'string') {
      errors.push({ property: 'degreeName', message: 'Degree name must be a string' });
    } else {
      result.degreeName = result.degreeName.trim();
    }
    
    // Validate and trim degreeSubject
    if (!result.degreeSubject) {
      errors.push({ property: 'degreeSubject', message: 'Degree subject is required' });
    } else if (typeof result.degreeSubject !== 'string') {
      errors.push({ property: 'degreeSubject', message: 'Degree subject must be a string' });
    } else {
      result.degreeSubject = result.degreeSubject.trim();
    }
    
    // Validate issueDate
    if (!result.issueDate) {
      errors.push({ property: 'issueDate', message: 'Issue date is required' });
    } else {
      const date = new Date(result.issueDate);
      if (isNaN(date.getTime())) {
        errors.push({ property: 'issueDate', message: 'Invalid date format' });
      } else {
        result.issueDate = date;
      }
    }
    
    // Return validation result
    if (errors.length > 0) {
      return {
        error: {
          details: errors.map(err => ({ message: `${err.property}: ${err.message}` }))
        },
        value: result
      };
    }
    
    return { value: result };
  }
}

export const issueCertificateSchema = new IssueCertificateSchema();

/**
 * Validates an IssueCertificateDto object using Joi schema
 * @param dto The DTO to validate
 * @returns Validated and sanitized DTO or throws validation error
 */
export function validateIssueCertificateDto(dto: any): IssueCertificateDto {
  const { error, value } = issueCertificateSchema.validate(dto, {
    abortEarly: false,
    stripUnknown: true
  });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    throw new Error(`Validation error: ${errorMessage}`);
  }
  
  return value as IssueCertificateDto;
}