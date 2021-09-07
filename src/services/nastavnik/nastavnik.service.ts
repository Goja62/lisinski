/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Nastavnik } from "src/entities/nastavnik.entity";
import { Repository } from "typeorm";

@Injectable()
export class NastavnikService extends TypeOrmCrudService<Nastavnik> {
    constructor(@InjectRepository(Nastavnik) private readonly nastavnik: Repository<Nastavnik>) {
        super(nastavnik)
    } 
}
