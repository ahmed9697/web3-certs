# TypeScript 5.9 Validation Solution

## Problem

The project encountered TypeScript 5.9 decorator compatibility issues with class-validator and class-transformer decorators. The error messages indicated that the decorators were not compatible with the new TypeScript 5.9 decorator format.

## Solution

We implemented a two-part solution to address the decorator compatibility issues:

### 1. TypeScript Configuration

Added the `decorators` option to `tsconfig.json` to use legacy decorator behavior:

```json
"compilerOptions": {
  // ... other options
  "emitDecoratorMetadata": true,
  "experimentalDecorators": true,
  "decorators": { "version": "legacy" },
  // ... other options
}
```

### 2. Alternative Validation Approaches

Implemented two alternative validation approaches that don't rely on property decorators:

#### a. Custom Validation Pipe

Created a custom `ValidationPipe` that uses class-validator without decorators:

- Location: `src/common/pipes/validation.pipe.ts`
- Features:
  - Transforms plain objects to class instances
  - Trims string properties automatically
  - Validates using class-validator
  - Returns detailed validation error messages

#### b. Joi Schema Validation

Implemented Joi schema validation as an alternative:

- Schema: `src/certificates/dto/issue-certificate.schema.ts`
- Pipe: `src/common/pipes/joi-validation.pipe.ts`
- Features:
  - Schema-based validation
  - Custom error messages
  - String trimming
  - Type conversion

## Usage

### Using the Custom Validation Pipe

```typescript
// In your controller
import { ValidationPipe } from '../common/pipes/validation.pipe';

@Post()
async create(@Body(new ValidationPipe()) dto: IssueCertificateDto) {
  // dto is validated and transformed
  return this.service.create(dto);
}
```

### Using Custom Schema Validation

```typescript
// In your controller
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { issueCertificateSchema } from './dto/issue-certificate.schema';

@Post()
async create(@Body(new JoiValidationPipe(issueCertificateSchema)) dto: IssueCertificateDto) {
  // dto is validated and transformed
  return this.service.create(dto);
}
```

This approach uses a custom schema validator that:
- Doesn't rely on external libraries like Joi
- Is compatible with TypeScript 5.9
- Provides detailed validation error messages
- Automatically trims string inputs
- Validates email format and date values

## Benefits

- Maintains validation functionality without decorator compatibility issues
- Provides detailed validation error messages
- Automatically trims string inputs
- Works with TypeScript 5.9 and NestJS 11