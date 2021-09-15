/* eslint-disable prettier/prettier */
import {  Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { AddUcenikDto } from "src/dtos/ucenik/add.ucenik.dto";
import { NivoSkolovanja } from "src/entities/nivo-skolovanja.entety";
import { Ucenik } from "src/entities/ucenik.entety";
import { ApiResponse } from "src/misc/api.response";
import { Repository } from "typeorm";

@Injectable()

export class UcenikService extends TypeOrmCrudService<Ucenik>{
    constructor(
        @InjectRepository(Ucenik) private readonly ucenik: Repository<Ucenik>,
        @InjectRepository(NivoSkolovanja) private readonly nivoSkolovanja: Repository<NivoSkolovanja>,
    ) 
    { 
        super(ucenik)
    }

    async pregledSvihUcenika(): Promise<Ucenik[]> {
       return await this.ucenik.find()

    } 

    async kreiranjeNovogUcenika(data: AddUcenikDto): Promise<Ucenik | ApiResponse> {
        const noviUcenik = new Ucenik()
        noviUcenik.prezime = data.prezimeUcenika;
        noviUcenik.ime = data.imeUcenika;
        noviUcenik.nivoSkolovanjaId = data.nivoSkolovanja;

        await this.ucenik.save(noviUcenik)

        const nivoSkolovanja = new NivoSkolovanja();
        nivoSkolovanja.naziv = data.nazivNivoa

        const rezultat =  this.ucenik.findOne(noviUcenik.ucenikId, {
            relations: [
                'nivoSkolovanja'
            ]
        })
        console.log(rezultat)
        return rezultat;
    }
}