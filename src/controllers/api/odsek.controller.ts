/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from "@nestjs/common";
import { AddOdsekDto } from "src/dtos/odesk/add.odsek.dto";
import { OdsekService } from "src/services/odsek/odsek.service";

@Controller('api/odsek') 
export class OdsekController {
    constructor(public service: OdsekService) {}

    //http://localhost:3000/api/odsek/kreiranjeOdseka
    @Post('kreiranjeOdseka')
    kreiranjeOdseka(@Body() data: AddOdsekDto) {
        return this.service.kreiranjeOdseka(data)
    }

}
    