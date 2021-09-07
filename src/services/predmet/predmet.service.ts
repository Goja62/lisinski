/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Predmet } from "src/entities/predmet.entity";
import { Repository } from "typeorm";

@Injectable()
export class PredmetService extends TypeOrmCrudService<Predmet> {
    constructor(@InjectRepository(Predmet) private readonly predmet: Repository<Predmet>) {
        super(predmet)
    }
}