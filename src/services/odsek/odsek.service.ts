/* eslint-disable prettier/prettier */
import {  Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddOdsekDto } from "src/dtos/odesk/add.odsek.dto";
import { Nastavnik } from "src/entities/nastavnik.entety";
import { Odsek } from "src/entities/odsek.entity";
import { ApiResponse } from "src/misc/api.response";
import { Repository } from "typeorm";

@Injectable()
export class OdsekService {
    constructor(
        @InjectRepository(Odsek) private readonly odsek: Repository<Odsek>,
        @InjectRepository(Nastavnik) private readonly nastavnik: Repository<Nastavnik>
    ) {}

    async kreiranjeOdseka(data: AddOdsekDto): Promise<Odsek | ApiResponse> {
       const noviOdsek: Odsek = new Odsek()
       noviOdsek.nastavnikId = data.nastavnikId;
       noviOdsek.nazivOdseka = data.nazivOdeska;
       noviOdsek.napomenaOdsek = data.napomenaOdsek;

       await this.odsek.save(noviOdsek);

       const noviNastavnik: Nastavnik = new Nastavnik()
       noviNastavnik.prezime = data.nastavnikPrezime;
       noviNastavnik.ime = data.nastavnikIme;

       await this.nastavnik.save(noviNastavnik)
       
       return await this.odsek.findOne(noviOdsek.odsekId, {
           relations: [
               'nastavnik'
           ]
       });
    }
}