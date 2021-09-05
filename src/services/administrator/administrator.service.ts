/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from 'src/entities/administrator.entety';
import { Repository } from 'typeorm';

@Injectable()
export class AdministratorService {
    constructor(@InjectRepository(Administrator) private readonly administrator: Repository<Administrator>) {}

    async getAll(): Promise<Administrator[]> {
        return await this.administrator.find()
    }

    getById(id: number): Promise<Administrator> {
        return this.administrator.findOne(id)
    }
}
