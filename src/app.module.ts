/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/databaseConfiguration';
import { AppController } from './app.controller';
import { Administrator } from './enteties/administrator.enteti';
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
      ]
    }),
    TypeOrmModule.forFeature([
      Administrator,
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
