/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { AddAdministratorDto } from "src/dtos/administrator/add.administrator.dto";
import { EditAdministratorDto } from "src/dtos/administrator/edit.administrator.dto";
import { Administrator } from "src/entities/administrator.entety";
import { AdministratorService } from "src/services/administrator/administrator.service";

@Controller('api/administrator')
export class AdministratorController {
    constructor(private AdministratorService: AdministratorService) {}

  //http://localhost:3000/api/administrator
  @Get() 
  getAllAdministrators(): Promise<Administrator[]> {
    return this.AdministratorService.getAll()
  }
  
  //http://localhost:3000/api/administrator/:id
  @Get('/:id') 
  getById(@Param('id') administratorId: number): Promise<Administrator> {
    return this.AdministratorService.getById(administratorId)
  }

  //http://localhost:3000/api/administrator
  @Post()
  add(@Body() data: AddAdministratorDto): Promise<Administrator> {
      return this.AdministratorService.add(data)
  }

  //http://localhost:3000/api/administrator/:id
  @Patch(':id')
  edit(@Param('id') id: number, @Body() data: EditAdministratorDto): Promise<Administrator> {
      return this.AdministratorService.editById(id, data)
  }


}