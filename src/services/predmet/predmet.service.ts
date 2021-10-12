/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { AddPredtmetDto } from "src/dtos/predmet/add.predmet.dto";
import { SearchPredmetDto } from "src/dtos/predmet/search.predmet.dto";
import { Predmet } from "src/entities/predmet.entity";
import { ApiResponse } from "src/misc/api.response";
import { Repository } from "typeorm";

@Injectable()
export class PredmetService extends TypeOrmCrudService<Predmet> {
    constructor(@InjectRepository(Predmet) private readonly predmet: Repository<Predmet>) {
        super(predmet)
    }

    async kreirajPredmet(data: AddPredtmetDto): Promise<Predmet | ApiResponse> {
        const noviPredmet = new Predmet()
        noviPredmet.naziv = data.nazivPredmeta;
        noviPredmet.nastavnikId = data.nastavnikId;
        noviPredmet.napomenaPredmet = data.napomenaPredmet;
        noviPredmet.ucenikId = data.ucenikId;

        const sacuvaniPredmet = await this.predmet.save(noviPredmet)

        if (!sacuvaniPredmet) {
            return new ApiResponse('error', -8001, 'Predmet se ne može sačuvati')
        }

        return await this.predmet.findOne(noviPredmet.predmetId, {
            relations: [
                'nastavnik',
                'ucenik',
                'ucenik.nivoSkolovanja'
            ]
        })
    }

    async pregledPredmeta(data: SearchPredmetDto): Promise<Predmet[] | ApiResponse> {
        const builder =  await this.predmet.createQueryBuilder("predmet")

       builder.leftJoinAndSelect("predmet.nastavnik", "pnas")

      //builder.where('predmet.predmetId = :Id', { Id: data.predmetId });

        if (data.keywords && data.keywords.length > 0) {
            builder.andWhere(`(
                                predmet.naziv LIKE :kw OR
                                predmet.napomenaPredmet LIKE :kw
                              )`,
                              { kw: '%' + data.keywords.trim() + '%' });
        }
        
        
        if (data.nastavnici && data.nastavnici.length > 0) {
            for (const nastavnik of data.nastavnici) {
                builder.andWhere('pnas.nastavnikId = :nasId AND pnas.prezime IN (:prez)', 
                    { 
                        nasId: nastavnik.nastavnikId, 
                        prez: nastavnik.prezimena
,                    }
                )
            } 
        }

        let orderBy = 'predmet.naziv';
        let sort: 'ASC' | 'DESC' = 'ASC';

        if (data.orderBy) {
            orderBy = data.orderBy

            if (orderBy === 'nastavnikId') {
                orderBy = 'pnas.nastavnikId'
            }

            if (orderBy === 'naziv') {
                orderBy = 'predmet.naziv'
            }
        }

        if (data.sort) {
            sort = data.sort
        }

        builder.orderBy(orderBy, sort)

        let starne = 0;
        let zapisiPoStrani = 25;

        if (data.strane && typeof data.strane === "number") {
            starne = data.strane
        }

        if (data.zapisiPoStrani && typeof data.zapisiPoStrani === 'number') {
            zapisiPoStrani = data.zapisiPoStrani
        }

        builder.skip(starne * zapisiPoStrani)
        builder.take(zapisiPoStrani)

        const rezultat = await builder.getMany();


        if (rezultat.length === 0) {
            return new ApiResponse("ok", 0, "No articles found for these search parameters.");
        }


        return rezultat;
    }
}