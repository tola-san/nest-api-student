import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

//  decorator to inject the prisma service into the application 
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
