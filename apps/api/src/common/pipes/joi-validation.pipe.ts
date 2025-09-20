import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

/**
 * Generic schema interface for validation
 */
export interface ValidationSchema {
  validate(value: any, options?: any): {
    error?: {
      details: Array<{ message: string }>
    };
    value: any;
  };
}

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ValidationSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }
    
    const { error, value: validatedValue } = this.schema.validate(value, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errorMessages
      });
    }
    
    return validatedValue;
  }
}