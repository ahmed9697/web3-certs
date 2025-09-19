import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // <-- This makes the module's exports available everywhere
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <-- This makes PrismaService available for injection
})
export class PrismaModule {}
