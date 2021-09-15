/* eslint-disable prettier/prettier */
import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Predmet } from "src/entities/predmet.entity";
import { PredmetService } from "src/services/predmet/predmet.service";

//http://localhost:3000/api/predmet
@Controller('api/predmet')
@Crud({
    model: {
        type: Predmet
    },
    params: {
        id: {
            field: 'predmetId',
            type: 'number',
            primary: true
        }
    },
    query: {
        join: {
            nastavnik: {
                eager: true
            }
        }
    }
})
export class PredmetController {
    constructor(public service: PredmetService) {}
}