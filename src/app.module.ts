/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/databaseConfiguration';
import { AppController } from './app.controller';
import { Administrator } from './entities/administrator.entety';
import { Nastavnik } from './entities/nastavnik.entity';
import { Odsek } from './entities/odsek.entity';
import { Predmet } from './entities/predmet.entity';
import { AdministratorService } from './services/administrator/administrator.service';

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
      ]
    }),
    TypeOrmModule.forFeature([
      Administrator,
      Nastavnik,
      Odsek,
      Predmet,
    ])
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AdministratorService,
  ],
})
export class AppModule {}
