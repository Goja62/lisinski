/* eslint-disable prettier/prettier */
import { Controller, Get, Param } from '@nestjs/common';
import { Administrator } from './entities/administrator.entety';
import { AdministratorService } from './services/administrator/administrator.service';

@Controller()
export class AppController {
  constructor(private administratorService: AdministratorService) {}


  @Get('api/administrator')
  getAllAdministrators(): Promise<Administrator[]> {
    return this.administratorService.getAll()
  }
  
  @Get('api/administrator/:id') 
  getById(@Param('id') administratorId: number): Promise<Administrator> {
    return this.administratorService.getById(administratorId)
  }
}
