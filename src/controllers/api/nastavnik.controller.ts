/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { AddNastavnikDto } from "src/dtos/nastavnik/add.nastavnik.dto";
import { Nastavnik } from "src/entities/nastavnik.entety";
import { ApiResponse } from "src/misc/api.response";
import { NastavnikService } from "src/services/nastavnik/nastavnik.service";

//http://localhost:3000/api/nastavnik
@Controller('api/nastavnik')
@Crud({
    model: {
        type: Nastavnik
    },
    params: {
        id: {
            field: 'nastavnikId',
            type: 'number',
            primary: true
        }
    },
    query: {
        join: {
            predmeti: {
                eager: true,
            },
            odseci: {
                eager: true,
            }
        }
    }
})
export class NastavnikController {
    constructor(public service: NastavnikService) {}

    //http://localhost:3000/api/nastavnik/napraviNastavnika
    @Post('napraviNastavnika')
    async PravljenjeKompletnogNastavnika(@Body() data: AddNastavnikDto): Promise<Nastavnik | ApiResponse> {
        
        return await this.service.PravljenjeKompletnogNastavnika(data)
    }
}