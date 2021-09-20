/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Slika } from "src/entities/slika.entety";
import { Repository } from "typeorm";

@Injectable()
export class SlikaService extends TypeOrmCrudService<Slika> {
    constructor(@InjectRepository(Slika) private readonly slika: Repository<Slika>) {
        super(slika)
    }

    dodavanjeSlike(novaSlika: Slika): Promise<Slika> {
        return this.slika.save(novaSlika);
    }

    brisanjeSlike(id: number) {
        return this.slika.delete(id);
    }
}

