/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Ucenik } from "src/entities/ucenik.entety";
import { Repository } from "typeorm";

@Injectable()
export class UcenikService extends TypeOrmCrudService<Ucenik> {
    constructor(@InjectRepository(Ucenik) private readonly ucenik: Repository<Ucenik>) {
        super(ucenik);
    }
}