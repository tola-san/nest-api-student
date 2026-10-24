import { Injectable, OnModuleInit, OnModuleDestroy , Logger} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


// decorator to inject the prisma service into the application 
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  

  // log all the prisma queries 
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  //  create instance of logger  
  private readonly logger = new Logger(PrismaService.name);


  //  connecting prisma client when module is initialized 
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma connected successfully');
  }

  //  disconnecting prisma client when module is destroyed 
  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma disconnected');
  }
}
