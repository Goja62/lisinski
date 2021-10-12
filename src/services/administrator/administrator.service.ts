/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from 'src/entities/administrator.entety';
import { Repository } from 'typeorm';
import * as crypto from 'crypto' 
import { AddAdministratorDto } from 'src/dtos/administrator/add.administrator.dto';
import { EditAdministratorDto } from 'src/dtos/administrator/edit.administrator.dto';
import { ApiResponse } from 'src/misc/api.response';

@Injectable()
export class AdministratorService {
    constructor(@InjectRepository(Administrator) private readonly administrator: Repository<Administrator>) {}

    async getAll(): Promise<Administrator[]> {
        return await this.administrator.find()
    }

    async getById(administartorId: number): Promise<Administrator | ApiResponse> {
            return new Promise(async (resolve) => {
                let admin = await this.administrator.findOne(administartorId)
                if (admin === undefined || !admin) {
                resolve(new ApiResponse('Greška!', -1002, 'Nije pronađen administrator'))
            }

            resolve(admin);
        })
    }

    async getByUsername(username: string): Promise<Administrator | null> {
        const administrator = await this.administrator.findOne({
            username: username
        })

        if (administrator) {
            return administrator
        }

        return null
    }

    add(data: AddAdministratorDto): Promise<Administrator | ApiResponse> {
        const passwordHash = crypto.createHash('sha512'); 
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        const newAdmin: Administrator = new Administrator()
        newAdmin.username = data.username;
        newAdmin.passwordHash = passwordHashString;
        
        return new Promise((resolve) => {
            this.administrator.save(newAdmin)
            .then(data => resolve(data))
            .catch(error => {
                const response: ApiResponse = new ApiResponse('greška', -1001, 'Već postoji administrator sa imenom ' + newAdmin.username)
                resolve(response);
            })
        })
    }

    async editById(id: number, data: EditAdministratorDto): Promise<Administrator | ApiResponse> {
        let admin: Administrator = await this.administrator.findOne(id)
        if (admin === undefined || !admin) {
            return new Promise((resolve) => {
                const response: ApiResponse = new ApiResponse('Greška!', -1002, 'Nije pronađen administrator')
                resolve(response);
            })
        }

        const passwordHash = crypto.createHash('sha512'); 
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        admin.passwordHash = passwordHashString

        return this.administrator.save(admin)
    }
}
