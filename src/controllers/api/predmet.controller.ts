/* eslint-disable prettier/prettier */
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { AddPredtmetDto } from "src/dtos/predmet/add.predmet.dto";
import { SearchPredmetDto } from "src/dtos/predmet/search.predmet.dto";
import { Predmet } from "src/entities/predmet.entity";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { ApiResponse } from "src/misc/api.response";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
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
            }, 
            ucenik: {
                eager: true
            }
        }
    },
    routes: {
        only: [
            "createOneBase",
            "createManyBase",
            "getOneBase",
            "getManyBase",
            "updateOneBase",
        ],
        createOneBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles('ucenik', "nastavnik", "administrator")
            ]
        },
        createManyBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles('nastavnik', "administrator")
            ]
        },
        getOneBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles('nastavnik', "administrator", "ucenik")
            ]
        },
        getManyBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles('nastavnik', "administrator")
            ]
        },
        updateOneBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles("administrator")
            ]
        }
    }
})
export class PredmetController {
    constructor(public service: PredmetService) {}

    //http://localhost:3000/api/predmet/kreirajPredmet
    @Post('kreirajPredmet')
    async kreirajPredmet(@Body() data: AddPredtmetDto) {
        return await this.service.kreirajPredmet(data)
    }

    //http://localhost:3000/api/predmet/pregledPredmeta
    @Post('pregledPredmeta')
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('administrator', 'nastavnik')
    async pregledPredmeta(@Body() data: SearchPredmetDto): Promise<Predmet[] | ApiResponse> {
        return await this.service.pregledPredmeta(data)
    }

}