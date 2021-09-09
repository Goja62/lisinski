/* eslint-disable prettier/prettier */
import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Ucenik } from "src/entities/ucenik.entety";
import { UcenikService } from "src/services/ucenik/ucenik.service";

@Controller('api/ucenik')
@Crud({
    model: {
        type: Ucenik,
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
            nivoiSkolovanja: {
                eager: true,
            }
        }
    }
})
export class UcenikController {
    constructor(public service: UcenikService) {}
}