/* eslint-disable prettier/prettier */
import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Nastavnik } from "src/entities/nastavnik.entity";
import { NastavnikService } from "src/services/nastavnik/nastavnik.service";

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
            predmets: {
                eager: true,
            },
            odseks: {
                eager: true,
            }
        }
    }
})
export class NastavnikController {
    constructor(public service: NastavnikService) {}
}