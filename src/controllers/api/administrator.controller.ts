/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { AddAdministratorDto } from "src/dtos/administrator/add.administrator.dto";
import { EditAdministratorDto } from "src/dtos/administrator/edit.administrator.dto";
import { Administrator } from "src/entities/administrator.entety";
import { ApiResponse } from "src/misc/api.response";
import { AdministratorService } from "src/services/administrator/administrator.service";

@Controller('api/administrator')
export class AdministratorController {
    constructor(private administratorService: AdministratorService) {}

  //http://localhost:3000/api/administrator
  @Get() 
  getAllAdministrators(): Promise<Administrator[]> {
    return this.administratorService.getAll()
  }
  
  //http://localhost:3000/api/administrator/:id
  @Get('/:id') 
  getById(@Param('id') administratorId: number): Promise<Administrator | ApiResponse> {
    return this.administratorService.getById(administratorId)
  }

  //http://localhost:3000/api/administrator
  @Post()
  add(@Body() data: AddAdministratorDto): Promise<Administrator | ApiResponse> {
      return this.administratorService.add(data)
  }

  //http://localhost:3000/api/administrator/:id
  @Patch(':id')
  edit(@Param('id') id: number, @Body() data: EditAdministratorDto): Promise<Administrator | ApiResponse> {
      return this.administratorService.editById(id, data)
  }
}