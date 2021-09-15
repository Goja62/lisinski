/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { AddNastavnikDto } from "src/dtos/nastavnik/add.nastavnik.dto";
import { Nastavnik } from "src/entities/nastavnik.entety";
import { Predmet } from "src/entities/predmet.entity";
import { Ucenik } from "src/entities/ucenik.entety";
import { ApiResponse } from "src/misc/api.response";
import { Repository } from "typeorm";

@Injectable()
export class NastavnikService extends TypeOrmCrudService<Nastavnik> {
    constructor(
        @InjectRepository(Nastavnik) private readonly nastavnik: Repository<Nastavnik>,
        @InjectRepository(Predmet) private readonly predmet: Repository<Predmet>,
        @InjectRepository(Ucenik) private readonly ucenik: Repository<Ucenik>
    ) {
        super(nastavnik)
    } 

    async PravljenjeKompletnogNastavnika(data: AddNastavnikDto): Promise<Nastavnik | ApiResponse> {
        const noviNastavnik = new Nastavnik();
        noviNastavnik.email = data.email;
        noviNastavnik.passwordHash = data.password;
        noviNastavnik.prezime = data.prezime;
        noviNastavnik.ime = data.ime;
        noviNastavnik.napomenaNastavnik = data.napomenaNastavnik;
        noviNastavnik.telefon = data.telefon;

        const sacuvaniNastavnik = await this.nastavnik.save(noviNastavnik)
        
        for (const predmet of data.predmeti) {
            const noviPredmet = new Predmet()
            noviPredmet.nastavnikId = sacuvaniNastavnik.nastavnikId;
            noviPredmet.naziv = predmet.nazivPredmeta;
            noviPredmet.napomenaPredmet = predmet.napomenaPredmet;

            await this.predmet.save(noviPredmet)
        }

       return this.nastavnik.findOne(noviNastavnik.nastavnikId, {
            relations: [
                'predmeti'
            ]
        })
    }
}
