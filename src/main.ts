/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SkladisteConfig } from 'config/skladiste.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useStaticAssets(SkladisteConfig.slika.destinacija, {
    prefix: SkladisteConfig.slika.urlPrefix,
    maxAge: SkladisteConfig.slika.maxAge,
  })


  await app.listen(3000);
}
bootstrap()
