import { ValidationPipe , Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  const logger = new Logger();
  
  const app = await NestFactory.create(AppModule);

  app.use((req,res, next)=> {
    logger.log(`Request: ${req.method} ${req.url}`);
    next();
  })


  // Enable automatic validation of incoming request bodies using class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip non-whitelisted properties
      forbidNonWhitelisted: true, // throw an error if unknown properties are passed
      transform: true, // auto-transform payloads to DTO instances
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Student API is running on http://localhost:${port}`);
}

bootstrap();
