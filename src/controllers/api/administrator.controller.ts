/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Body, Controller, Get, Param, Patch, Post, SetMetadata, UseGuards } from "@nestjs/common";
import { AddAdministratorDto } from "src/dtos/administrator/add.administrator.dto";
import { EditAdministratorDto } from "src/dtos/administrator/edit.administrator.dto";
import { Administrator } from "src/entities/administrator.entety";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { ApiResponse } from "src/misc/api.response";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { AdministratorService } from "src/services/administrator/administrator.service";

@Controller('api/administrator')
export class AdministratorController {
    constructor(private administratorService: AdministratorService) {}

  //http://localhost:3000/api/administrator
  @Get() 
  @UseGuards(RoleCheckerGuard)
  @AllowToRoles('administrator')
  getAllAdministrators(): Promise<Administrator[]> {
    return this.administratorService.getAll()
  }
  
  //http://localhost:3000/api/administrator/:id
  @Get('/:id')
  @UseGuards(RoleCheckerGuard)
  @AllowToRoles('administrator')
  getById(@Param('id') administratorId: number): Promise<Administrator | ApiResponse> {
    return this.administratorService.getById(administratorId)
  }

  //http://localhost:3000/api/administrator
  @Post()
  @UseGuards(RoleCheckerGuard)
  @AllowToRoles('administrator')
  add(@Body() data: AddAdministratorDto): Promise<Administrator | ApiResponse> {
      return this.administratorService.add(data)
  }

  //http://localhost:3000/api/administrator/:id
  @Patch(':id')
  @UseGuards(RoleCheckerGuard)
  @AllowToRoles('administrator')
  edit(@Param('id') id: number, @Body() data: EditAdministratorDto): Promise<Administrator | ApiResponse> {
      return this.administratorService.editById(id, data)
  }
}