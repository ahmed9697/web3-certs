declare module '@nestjs/core' {
  export * from '@nestjs/common';
  export const NestFactory: any;
}

declare module '@nestjs/swagger' {
  export const SwaggerModule: any;
  export class DocumentBuilder {
    setTitle(title: string): this;
    setDescription(description: string): this;
    setVersion(version: string): this;
    addBearerAuth(): this;
    build(): any;
  }
  export const ApiProperty: any;
}

declare module '@nestjs/bullmq' {
  export const BullModule: any;
  export const InjectQueue: any;
}
