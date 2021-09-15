/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { AddUcenikDto } from "src/dtos/ucenik/add.ucenik.dto";
import { Ucenik } from "src/entities/ucenik.entety";
import { UcenikService } from "src/services/ucenik/ucenik.service";

@Controller('api/ucenik')
@Crud({
    model: {
        type: Ucenik
    },
    params: {
        id: {
            field: 'ucenikId',
            type: 'number',
            primary: true
        }
    },
    query: {
        join: {
            nivoSkolovanja: {
                eager: true
            }
        }
    }
})

export class UcenikController {
    constructor(private service: UcenikService) { }

    //http://localhost:3000/api/ucenik/sviUcenici
    @Get('sviUcenici')
    pregledSvihUcenika() {
        return this.service.pregledSvihUcenika()
    }

    @Post('noviUcenik')
    kreiranjeNovogUcenika(@Body() data: AddUcenikDto) {
        return this.service.kreiranjeNovogUcenika(data)
    }
}