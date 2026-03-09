import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './_common/exception/http.exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { TimersInterceptor } from './_common/interceptor/timers.interceptor';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import basicAuth from 'express-basic-auth';
import helmet from 'helmet';
import express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(
    '/public',
    express.static(join(__dirname, '..', 'public'), {
      setHeaders: (res, path) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TimersInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      always: true,
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const findFirstError = (errors: ValidationError[]) => {
          for (const error of errors) {
            if (error.constraints) {
              return Object.values(error.constraints)[0];
            }
          }
        };

        throw new BadRequestException(findFirstError(errors));
      },
    }),
  );
  app.use(helmet());
  app.use(
    '/docs',
    basicAuth({
      challenge: true,
      users: { admin: '12345' },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('BLOG APP')
    .setDescription('blog application')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, documentFactory);
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
