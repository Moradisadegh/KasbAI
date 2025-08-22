import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // --- Security ---
  app.use(helmet());
  app.enableCors({
    origin: 'https://mykasbai.ir', // Or load from env
    credentials: true,
  });
  app.use(cookieParser());

  // --- Global Prefix ---
  app.setGlobalPrefix('app/api');

  // --- Validation ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // --- Health Checks ---
  app.enableShutdownHooks();

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`API is running on: http://localhost:${port}/app/api`);
}
bootstrap();
