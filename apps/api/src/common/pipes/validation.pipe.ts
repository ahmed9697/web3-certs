import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    
    // Transform plain objects to class instances
    const object = plainToInstance(metatype, value);
    
    // Apply string trimming for string properties
    this.trimStringProperties(object);
    
    // Validate using class-validator
    const errors = await validate(object);
    
    if (errors.length > 0) {
      const messages = errors.map(error => {
        const constraints = error.constraints || {};
        return Object.values(constraints)[0] || `Validation failed for ${error.property}`;
      });
      
      throw new BadRequestException({
        message: 'Validation failed',
        errors: messages
      });
    }
    
    return object;
  }
  
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
  
  private trimStringProperties(object: any): void {
    if (!object || typeof object !== 'object') return;
    
    Object.keys(object).forEach(key => {
      if (typeof object[key] === 'string') {
        object[key] = object[key].trim();
      } else if (typeof object[key] === 'object') {
        this.trimStringProperties(object[key]);
      }
    });
  }
}