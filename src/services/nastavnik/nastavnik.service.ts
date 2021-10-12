/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Body, Injectable } from "@nestjs/common";
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
import { SearchNastavnikDto } from "src/dtos/nastavnik/search.nastavnika.dto";
import { NastavnikToken } from "src/entities/nastavnik.token.entity";

@Injectable()
export class NastavnikService extends TypeOrmCrudService<Nastavnik> {
    constructor(
        @InjectRepository(Nastavnik) private readonly nastavnik: Repository<Nastavnik>,
        @InjectRepository(Predmet) private readonly predmet: Repository<Predmet>,
        @InjectRepository(Ucenik) private readonly ucenik: Repository<Ucenik>,
        @InjectRepository(NastavnikToken) private readonly nastavnikToken: Repository<NastavnikToken>
    ) {
        super(nastavnik)
    } 

    async getById(nastavnikId: number) {
        return await this.nastavnik.findOne(nastavnikId)
}

    async getByEmail(email: string): Promise<Nastavnik | null> {
        const nastavnik = await this.nastavnik.findOne({
            email: email
        })

        if (nastavnik) {
            return nastavnik
        }

        return null
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

    async pretragaNastavnik(data: SearchNastavnikDto): Promise<Nastavnik[] | ApiResponse> {
        const builder = await this.nastavnik.createQueryBuilder("nastavnik");

        builder.andWhere('nastavnik.nastavnikId = :id', { id: data.nastavnikId })
      
        builder.leftJoinAndSelect("nastavnik.predmeti", "np")
        

        if (data.predmeti && data.predmeti.length > 0) {
            for (const predmet of data.predmeti) {
                builder.andWhere('np.nastavnikId = :nasId AND np.naziv IN (:naz)', 
                { 
                    nasId: predmet.nastavnikId,
                    naz: predmet.predmeti,
                 })
            }
        }

        const nastavnici = await builder.getMany()

        if (nastavnici.length === 0) {
            return new ApiResponse("error", -9001, "Nijedan nastavnik nije pronađen")
        }

        return nastavnici
    }

    async addNastavnikToken(nastavnikId: number, token: string, datumIsteka: string) {
        const nastavnikToken = new NastavnikToken()
        nastavnikToken.nastavnikId = nastavnikId;
        nastavnikToken.token = token;
        nastavnikToken.datumIsteka = datumIsteka;

        return await this.nastavnikToken.save(nastavnikToken)
    }

    async getNastavnikToken(token: string): Promise<NastavnikToken> {
        return await this.nastavnikToken.findOne({
            token: token,
        })
    }

    async ponistavanjeTokena(token: string): Promise<NastavnikToken | ApiResponse> {
        const nastavnikToken =  await this.nastavnikToken.findOne({
            token: token,
        })

        if (!nastavnikToken) {
            return new ApiResponse('error', -10001, "Refresh token nije pronađen")
        }

        nastavnikToken.isValid = 0

        await this.nastavnikToken.save(nastavnikToken)

        return await this.getNastavnikToken(token)
    }

    async ponistavanjeNastavnikTokena(nastavnikId: number): Promise<(NastavnikToken | ApiResponse)[]> {
        const nastavnikTokeni = await this.nastavnikToken.find({
            nastavnikId: nastavnikId
        })

        const rezultati = [];

        for (const nastavnikToken of nastavnikTokeni) {
            rezultati.push(this.ponistavanjeTokena(nastavnikToken.token))
        }

        return rezultati
    }
}
