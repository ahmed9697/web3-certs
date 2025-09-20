/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-require-imports */
const NestFactory = require('@nestjs/core').NestFactory;
import { AppModule } from './app.module';
const SwaggerModule = require('@nestjs/swagger').SwaggerModule;
const DocumentBuilder = require('@nestjs/swagger').DocumentBuilder;
import { ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  // Swagger configuration
  const configBuilder = new DocumentBuilder();
  const builtConfig = configBuilder
    .setTitle('Web3 Certificates API')
    .setDescription('API for issuing and verifying academic certificates')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, builtConfig);
  SwaggerModule.setup('api', app, document);

  // Start server
  await app.listen(3001, 'localhost');
}

bootstrap();
