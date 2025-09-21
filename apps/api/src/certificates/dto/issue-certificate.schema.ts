import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import * as Joi from 'joi';
import { ValidationErrorItem } from 'joi'; //  <--  إضافة مهمة لتحديد نوع الخطأ

//  إضافة interface لتحديد شكل البيانات المتوقعة
interface IssueCertificateData {
  studentName: string;
  studentEmail: string;
  degreeName: string;
  degreeSubject: string;
  issueDate: string;
}

//Schema للتحقق من صحة البيانات
export const issueCertificateSchema = Joi.object<IssueCertificateData, true>({
  studentName: Joi.string().min(2).required().messages({
    'string.base': 'Student name must be a string.',
    'string.min': 'Student name must be at least 2 characters long.',
    'any.required': 'Student name is required.',
  }),

  studentEmail: Joi.string().email().required().messages({
    'string.base': 'Student email must be a string.',
    'string.email': 'Invalid email format.',
    'any.required': 'Student email is required.',
  }),

  degreeName: Joi.string().min(2).required().messages({
    'string.base': 'Degree name must be a string.',
    'string.min': 'Degree name must be at least 2 characters long.',
    'any.required': 'Degree name is required.',
  }),

  degreeSubject: Joi.string().min(2).required().messages({
    'string.base': 'Degree subject must be a string.',
    'string.min': 'Degree subject must be at least 2 characters long.',
    'any.required': 'Degree subject is required.',
  }),

  issueDate: Joi.string().isoDate().required().messages({
    'string.base': 'Issue date must be a string.',
    'string.isoDate': 'Issue date must be in a valid ISO 8601 date format.',
    'any.required': 'Issue date is required.',
  }),
});

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: Joi.ObjectSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }

    const { error } = this.schema.validate(value, {
      abortEarly: false, // Return all errors
    });

    if (error) {
      const errorMessages = error.details.map(
        (detail: ValidationErrorItem) => detail.message,
      );
      throw new BadRequestException(errorMessages);
    }

    return value;
  }
}
