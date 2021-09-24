/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { AddUcenikDto } from "src/dtos/ucenik/add.ucenik.dto";
import { Ucenik } from "src/entities/ucenik.entety";
import { ApiResponse } from "src/misc/api.response";
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

    //http://localhost:3000/api/ucenik/sviUcenici
    @Get('jedanUcenik/:id')
    async prikazJednogUcenika(@Param('id') ucenikId: number) {
        return await this.service.getById(ucenikId)
    }

    @Delete('brisanjeUcenika/:ucenikId')
    async brisanjeUcenika(@Param('ucenikId') ucenikId: number): Promise<Ucenik | ApiResponse> {
        const ucenik = await this.service.findOne({
            ucenikId: ucenikId
        })

        if (!ucenik) {
            return new ApiResponse('error', -6001, 'Učenik nije pronađen!')
        }

        const obrisaniUcenik =  await this.service.brisanjeUcenika(ucenikId)

        if (obrisaniUcenik.affected === 0) {
            return new ApiResponse('error', -6001, 'Učenik nije obrisan!')
        }

        return new ApiResponse('ok', 0, 'Obrisan je jedan učenik')
    }
}