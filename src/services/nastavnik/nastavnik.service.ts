/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { AddNastavnikDto } from "src/dtos/nastavnik/add.nastavnik.dto";
import { EditNastavnikDto } from "src/dtos/nastavnik/edit.nastavnik.dto";
import { Nastavnik } from "src/entities/nastavnik.entety";
import { Predmet } from "src/entities/predmet.entity";
import { Ucenik } from "src/entities/ucenik.entety";
import { ApiResponse } from "src/misc/api.response";
import { Repository } from "typeorm";
import * as crypto from 'crypto' 

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
        const passwordHash = crypto.createHash('sha512'); 
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        const noviNastavnik = new Nastavnik();
        noviNastavnik.email = data.email;
        noviNastavnik.passwordHash = passwordHashString;
        noviNastavnik.prezime = data.prezime;
        noviNastavnik.ime = data.ime;
        noviNastavnik.napomenaNastavnik = data.napomenaNastavnik;
        noviNastavnik.telefon = data.telefon;

        const sacuvaniNastavnik = await this.nastavnik.save(noviNastavnik)

        const sacuvaniUcenik = new Ucenik()
        sacuvaniUcenik.ucenikId = data.ucenik.ucenikId;

        await this.ucenik.save(sacuvaniUcenik);
        
        for (const predmet of data.predmeti) {
            const noviPredmet = new Predmet()
            noviPredmet.nastavnikId = sacuvaniNastavnik.nastavnikId;
            noviPredmet.naziv = predmet.nazivPredmeta;
            noviPredmet.napomenaPredmet = predmet.napomenaPredmet;
            noviPredmet.ucenikId = predmet.ucenikId;

            await this.predmet.save(noviPredmet)
        }

       return this.nastavnik.findOne(noviNastavnik.nastavnikId, {
            relations: [
                'predmeti',
                'predmeti.ucenik',
                'predmeti.ucenik.nivoSkolovanja'

            ]
        })
    }

    async editovanjeKompletnogNastavnika(nastavnikId: number, data: EditNastavnikDto): Promise<Nastavnik | ApiResponse> {
        const postojeciNastavnik: Nastavnik = await this.nastavnik.findOne(nastavnikId, {
            relations: [
                'predmeti',
                'predmeti.ucenik',
            ]
        });

        if (!postojeciNastavnik) {
            return new ApiResponse('error', -7001, 'Nastavnik nije pronađen');
        }

        postojeciNastavnik.prezime = data.prezime;
        postojeciNastavnik.ime = data.ime;
        postojeciNastavnik.telefon = data.telefon;
        postojeciNastavnik.napomenaNastavnik = data.napomenaNastavnik;
        postojeciNastavnik.email = data.email

        const sacuvaniNastavnik = await this.nastavnik.save(postojeciNastavnik);
        if (!sacuvaniNastavnik) {
            return new ApiResponse('error', -7002, 'Nije moguće sačuvati tražene podatke o nastavniku');
        }

        const sacuvaniUcenik = new Ucenik()
        sacuvaniUcenik.ucenikId = data.ucenik.ucenikId;

        await this.ucenik.save(sacuvaniUcenik);

        if (data.predmeti !== null) {
            await this.predmet.remove(postojeciNastavnik.predmeti)
            for (const predmet of data.predmeti) {
                const noviPredmet = new Predmet()
                noviPredmet.nastavnikId = sacuvaniNastavnik.nastavnikId;
                noviPredmet.naziv = predmet.nazivPredmeta;
                noviPredmet.napomenaPredmet = predmet.napomenaPredmet;
                noviPredmet.ucenikId = predmet.ucenikId;
    
                await this.predmet.save(noviPredmet)
            }
        }
        return this.nastavnik.findOne(sacuvaniNastavnik.nastavnikId, {
            relations: [
                'predmeti',
                'predmeti.ucenik',
                'predmeti.ucenik.nivoSkolovanja'

            ]
        })
    }
}
