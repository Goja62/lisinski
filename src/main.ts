/* eslint-disable prettier/prettier */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SkladisteConfig } from 'config/skladiste.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useStaticAssets(SkladisteConfig.slika.destinacija, {
    prefix: SkladisteConfig.slika.urlPrefix,
    maxAge: SkladisteConfig.slika.maxAge,
  });

  app.useGlobalPipes(new ValidationPipe())

  await app.listen(3000);
}
bootstrap()
