/* eslint-disable prettier/prettier */
import {  Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { AddUcenikDto } from "src/dtos/ucenik/add.ucenik.dto";
import { NivoSkolovanja } from "src/entities/nivo-skolovanja.entety";
import { Ucenik } from "src/entities/ucenik.entety";
import { ApiResponse } from "src/misc/api.response";
import { Repository } from "typeorm";
import * as crypto from 'crypto' 

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

    async getById(ucenikId: number): Promise<Ucenik | ApiResponse> {
        return new Promise(async (resolve) => {
            const ucenik = await this.ucenik.findOne(ucenikId)
            if (ucenik === undefined || !ucenik) {
            resolve(new ApiResponse('Greška!', -6002, 'Nije pronađen učenik'))
        }

        resolve(ucenik);
    })
}

async getByEmail(email: string): Promise<Ucenik | null> {
    const nastavnik = await this.ucenik.findOne({
        email: email
    })

    if (nastavnik) {
        return nastavnik
    }

    return null
}

    async kreiranjeNovogUcenika(data: AddUcenikDto): Promise<Ucenik | ApiResponse> {
        const passwordHash = crypto.createHash('sha512'); 
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        const noviUcenik = new Ucenik()
        noviUcenik.email = data.email;
        noviUcenik.passwordHash = passwordHashString;
        noviUcenik.prezime = data.prezimeUcenika;
        noviUcenik.ime = data.imeUcenika;
        noviUcenik.nivoSkolovanjaId = data.nivoSkolovanjaId;

        await this.ucenik.save(noviUcenik)
        
        const rezultat =  this.ucenik.findOne(noviUcenik.ucenikId, {
            relations: [
                'nivoSkolovanja'
            ]
        })
        console.log(rezultat)
        return rezultat;
    }

    brisanjeUcenika(id: number) {
        return this.ucenik.delete(id)
    }
}