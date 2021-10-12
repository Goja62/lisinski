/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/databaseConfiguration';
import { AdministratorController } from './controllers/api/administrator.controller';
import { AuthController } from './controllers/api/auth.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { NastavnikController } from './controllers/api/nastavnik.controller';
import { OdsekController } from './controllers/api/odsek.controller';
import { PredmetController } from './controllers/api/predmet.controller';
import { UcenikController } from './controllers/api/ucenik.controller';
import { AppController } from './controllers/app.controller';
import { Administrator } from './entities/administrator.entety';
import { Nastavnik } from './entities/nastavnik.entety';
import { NivoSkolovanja } from './entities/nivo-skolovanja.entety';
import { Odsek } from './entities/odsek.entity';
import { Predmet } from './entities/predmet.entity';
import { Ucenik } from './entities/ucenik.entety';
import { AdministratorService } from './services/administrator/administrator.service';
import { NastavnikService } from './services/nastavnik/nastavnik.service';
import { OdsekService } from './services/odsek/odsek.service';
import { PredmetService } from './services/predmet/predmet.service';
import { UcenikService } from './services/ucenik/ucenik.service';
import { Slika } from './entities/slika.entety';
import { SlikaService } from './services/slika/slika.service';
import { NastavnikToken } from './entities/nastavnik.token.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfiguration.hostname,
      port: 3306,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      entities: [
        Administrator,
        Nastavnik,
        Odsek,
        Predmet,
        NivoSkolovanja,
        Ucenik,
        Slika,
        NastavnikToken
      ]
    }),
    TypeOrmModule.forFeature([
      Administrator,
      Nastavnik,
      Odsek,
      Predmet,
      NivoSkolovanja,
      Ucenik,
      Slika,
      NastavnikToken,
    ])
  ],
  controllers: [
    AppController,
    AdministratorController,
    PredmetController,
    NastavnikController,
    UcenikController,
    OdsekController,
    AuthController,
  ],
  providers: [
    AdministratorService,
    NastavnikService,
    PredmetService,
    UcenikService,
    OdsekService,
    SlikaService,
  ],
  exports: [
    AdministratorService,
    NastavnikService,
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('auth/*')
      .forRoutes('api/*')
  }
  
}
