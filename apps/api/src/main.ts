import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // <-- تعطيل
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // const config = new DocumentBuilder()
  //   .setTitle('Web3 Certs API')
  //   .setDescription('API for issuing and verifying certificates on the blockchain.')
  //   .setVersion('1.0')
  //   .addBearerAuth()
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document); // <-- تعطيل كل هذا الجزء

  await app.listen(3001);
}
bootstrap();