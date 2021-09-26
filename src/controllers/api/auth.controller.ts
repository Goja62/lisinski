/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Req } from "@nestjs/common";
import { LoginAdministratorDto } from "src/dtos/administrator/login.administrator.dto";
import { Administrator } from "src/entities/administrator.entety";
import { ApiResponse } from "src/misc/api.response";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as crypto from 'crypto' 
import * as jwt from "jsonwebtoken"
import { JwtDataDto } from "src/dtos/auth/jwt.data.dto";
import { Request } from "express";
import { JwtSecret } from "config/jwt.secret";
import { NastavnikService } from "src/services/nastavnik/nastavnik.service";
import { LoginNastavnikDto } from "src/dtos/administrator/login.nastavnik.dto";
import { Nastavnik } from "src/entities/nastavnik.entety";
import { LoginInfoDto } from "src/dtos/auth/login.info.dto";
import { UcenikService } from "src/services/ucenik/ucenik.service";
import { LoginUcenikDto } from "src/dtos/administrator/login.ucenik.dto";
import { Ucenik } from "src/entities/ucenik.entety";

@Controller('auth')
export class AuthController {
    constructor(
        public administratorService: AdministratorService,
        public nastavnikService: NastavnikService,
        public ucenikService: UcenikService
    ) { }

    //http://localhost:3000/auth/administrator/login
    @Post('administrator/login')
    async doAdministratorLogin(@Body() data: LoginAdministratorDto, @Req() req: Request): Promise<LoginInfoDto | ApiResponse> {
        const administrator: Administrator = await this.administratorService.getByUsername(data.username);

        if(!administrator) {
            return new Promise(resolve => {
                resolve(new ApiResponse('Greška!', -3001, 'Nije pronađen administrator'))
            }) 
        }

        const passwordHash = crypto.createHash('sha512'); 
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        if (administrator.passwordHash !== passwordHashString) {
            return new Promise(resolve => {
                resolve(new ApiResponse('Greška!', -3002, 'Nije pronađen administrator'))
            }) 
        }

        const jwtData = new JwtDataDto()
        jwtData.role = "administrator"
        jwtData.id = administrator.administratorId;
        jwtData.identitet = administrator.username

        const sada = new Date();
        sada.setDate(sada.getDate() + 14)
        const istekTimeStamp = sada.getTime() / 1000
        jwtData.exp = istekTimeStamp
        jwtData.ip = req.ip
        jwtData.ua = req.headers['user-agent']

        const token: string = jwt.sign(jwtData.toPlainObject(), JwtSecret);

        const responseObject = new LoginInfoDto(
            administrator.administratorId,
            administrator.passwordHash,
            token,
        )

        return new Promise(resolve => resolve(responseObject))
    }

    //http://localhost:3000/auth/nastavnik/login
    @Post('nastavnik/login')
    async doNastavnikLogin(@Body() data: LoginNastavnikDto, @Req() req: Request): Promise<LoginInfoDto | ApiResponse> {
        const nastavnik: Nastavnik = await this.nastavnikService.getByEmail(data.email);

        if(!nastavnik) {
            return new Promise(resolve => {
                resolve(new ApiResponse('Greška!', -3001, 'Nije pronađen nastavnik'))
            }) 
        }

        const passwordHash = crypto.createHash('sha512'); 
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        if (nastavnik.passwordHash !== passwordHashString) {
            return new Promise(resolve => {
                resolve(new ApiResponse('Greška!', -3002, 'Nije pronađen administrator'))
            }) 
        }

        const jwtData = new JwtDataDto()
        jwtData.role = "nastavnik"
        jwtData.id = nastavnik.nastavnikId;
        jwtData.identitet = nastavnik.email

        const sada = new Date();
        sada.setDate(sada.getDate() + 14)
        const istekTimeStamp = sada.getTime() / 1000
        jwtData.exp = istekTimeStamp
        jwtData.ip = req.ip
        jwtData.ua = req.headers['user-agent']

        const token: string = jwt.sign(jwtData.toPlainObject(), JwtSecret);

        const responseObject = new LoginInfoDto(
            nastavnik.nastavnikId,
            nastavnik.passwordHash,
            token,
        )

        return new Promise(resolve => resolve(responseObject))
    }

    //http://localhost:3000/auth/ucenik/login
    @Post('ucenik/login')
    async doUcenikLogin(@Body() data: LoginUcenikDto, @Req() req: Request): Promise<LoginInfoDto | ApiResponse> {
        const ucenik: Ucenik = await this.ucenikService.getByEmail(data.email);

        if(!ucenik) {
            return new Promise(resolve => {
                resolve(new ApiResponse('Greška!', -3001, 'Nije pronađen nastavnik'))
            }) 
        }

        const passwordHash = crypto.createHash('sha512'); 
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        if (ucenik.passwordHash !== passwordHashString) {
            return new Promise(resolve => {
                resolve(new ApiResponse('Greška!', -3002, 'Nije pronađen administrator'))
            }) 
        }

        const jwtData = new JwtDataDto()
        jwtData.role = "ucenik"
        jwtData.id = ucenik.ucenikId;
        jwtData.identitet = ucenik.email

        const sada = new Date();
        sada.setDate(sada.getDate() + 14)
        const istekTimeStamp = sada.getTime() / 1000
        jwtData.exp = istekTimeStamp
        jwtData.ip = req.ip
        jwtData.ua = req.headers['user-agent']

        const token: string = jwt.sign(jwtData.toPlainObject(), JwtSecret);

        const responseObject = new LoginInfoDto(
            ucenik.ucenikId,
            ucenik.passwordHash,
            token,
        )

        return new Promise(resolve => resolve(responseObject))
    }
}