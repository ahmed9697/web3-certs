import {
  JoiValidationPipe,
  issueCertificateSchema,
} from '../dto/issue-certificate.schema';
import { BadRequestException } from '@nestjs/common';

// بيانات شهادة صالحة
const validCertificateData = {
  studentName: 'John Doe',
  studentEmail: 'john.doe@example.com',
  degreeName: 'Bachelor of Science',
  degreeSubject: 'Computer Science',
  issueDate: '2023-10-26T10:00:00.000Z',
};

// بيانات شهادة غير صالحة (اسم الطالب قصير جدًا والبريد الإلكتروني غير صالح)
const invalidCertificateData = {
  studentName: 'J',
  studentEmail: 'john.doe',
  degreeName: 'Bachelor of Science',
  degreeSubject: 'Computer Science',
  issueDate: '2023-10-26', // صيغة تاريخ صالحة، لكن البريد الإلكتروني والاسم لا
};

// إنشاء نسخة من الـ pipe للتحقق من الصحة
const validationPipe = new JoiValidationPipe(issueCertificateSchema);

/**
 * دالة للتحقق من صحة بيانات الشهادة ومعالجة الأخطاء.
 * @param data - البيانات المراد التحقق منها.
 */
function validateCertificateData(data: unknown) {
  console.log('--- Running Validation ---');
  try {
    console.log('Validating data:', data);
    const result = validationPipe.transform(data, { type: 'body' });
    console.log('✅ Validation successful:', result);
  } catch (error) {
    // التحقق من أن الخطأ هو من النوع المتوقع
    if (error instanceof BadRequestException) {
      const response = error.getResponse() as { message: string[] };
      console.error('❌ Validation failed:', response.message);
    } else {
      // معالجة الأخطاء غير المتوقعة
      console.error('An unexpected error occurred:', error);
    }
  }
  console.log('--------------------------\n');
}

// تشغيل أمثلة التحقق

// المثال الأول: بيانات صالحة
validateCertificateData(validCertificateData);

// المثال الثاني: بيانات غير صالحة
validateCertificateData(invalidCertificateData);
