/* eslint-disable prettier/prettier */
import { Body, Controller, HttpException, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { LoginAdministratorDto } from "src/dtos/administrator/login.administrator.dto";
import { Administrator } from "src/entities/administrator.entety";
import { ApiResponse } from "src/misc/api.response";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as crypto from 'crypto' 
import * as jwt from "jsonwebtoken"
import { JwtDataDto } from "src/dtos/auth/jwt.data.dto";
import { Request } from "express";
import { jwtSecret } from "config/jwt.secret";
import { NastavnikService } from "src/services/nastavnik/nastavnik.service";
import { LoginNastavnikDto } from "src/dtos/administrator/login.nastavnik.dto";
import { Nastavnik } from "src/entities/nastavnik.entety";
import { LoginInfoDto } from "src/dtos/auth/login.info.dto";
import { UcenikService } from "src/services/ucenik/ucenik.service";
import { LoginUcenikDto } from "src/dtos/administrator/login.ucenik.dto";
import { Ucenik } from "src/entities/ucenik.entety";
import { JwtRefreshDataDto } from "src/dtos/auth/jwt.refresh.data.dto";
import { Funkcije } from "src/misc/funkcije";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { NastavnikRefreshTokenDto } from "src/dtos/auth/nastavnik.refresh.token";

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

        const token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);

        const responseObject = new LoginInfoDto(
            administrator.administratorId,
            administrator.passwordHash,
            token,
            '',
            '',
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
                resolve(new ApiResponse('Greška!', -3002, 'Nije pronađen nastavnik'))
            }) 
        }
        const funkcije = new Funkcije()

        const jwtData = new JwtDataDto()
        jwtData.role = "nastavnik"
        jwtData.id = nastavnik.nastavnikId;
        jwtData.identitet = nastavnik.email
        jwtData.exp = funkcije.getDatePlus(60 * 10)
        jwtData.ip = req.ip
        jwtData.ua = req.headers['user-agent']

        const token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);

        const jwtRefreshData = new JwtRefreshDataDto()
        jwtRefreshData.role = "nastavnik";
        jwtRefreshData.id = nastavnik.nastavnikId;
        jwtRefreshData.identitet = nastavnik.email;
        jwtRefreshData.exp = funkcije.getDatePlus(60 * 60 * 24 * 31)
        jwtRefreshData.ip = req.ip;
        jwtRefreshData.ua = req.headers['user-agent']

        const refreshToken = jwt.sign(jwtRefreshData.toPlainObject(), jwtSecret)

        const responseObject = new LoginInfoDto(
            nastavnik.nastavnikId,
            nastavnik.passwordHash,
            token,
            refreshToken,
            funkcije.getIsoDate(jwtRefreshData.exp),
        )

        await this.nastavnikService.addNastavnikToken(nastavnik.nastavnikId, refreshToken, funkcije.getDatabseDateFormat(funkcije.getIsoDate(jwtRefreshData.exp)))

        return new Promise(resolve => resolve(responseObject))
    }

     //http://localhost:3000/api/token/nastavnik/refresh
     @Post('nastavnik/refresh')
     @UseGuards(RoleCheckerGuard)
     @AllowToRoles('nastavnik')
     async nastavnikRefreshToken(@Req() req: Request, @Body() data: NastavnikRefreshTokenDto): Promise<LoginInfoDto | ApiResponse> {
         const nastavnikToken =  await this.nastavnikService.getNastavnikToken(data.token)
 
         if (!nastavnikToken) {  
             return new ApiResponse('error', - 10002, "Nije pronađen refresh token")
         }
 
         if (nastavnikToken.isValid === 0) {
             return new ApiResponse('error', -10003, 'Token nije validan')
         }
 
         const sada = new Date()
         const datumIsteka = new Date(nastavnikToken.datumIsteka);

         if (datumIsteka.getTime() < sada.getTime()) {
             return new ApiResponse('error', -10004, 'Token je istekao')
         }

         let jwtRefreshData: JwtRefreshDataDto;
        
         try {
             jwtRefreshData = jwt.verify(data.token, jwtSecret);
         } catch (e) {
             throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
         }

         if (!jwtRefreshData) {
            throw new HttpException('Pronađen je neispravan refresh token', HttpStatus.UNAUTHORIZED);
        }

        if (jwtRefreshData.ip !== req.ip.toString()) {
            throw new HttpException('IP adresa nije pronađena', HttpStatus.UNAUTHORIZED);
        }

        if (jwtRefreshData.ua !== req.headers['user-agent']) {
            throw new HttpException('User agent nije pronađen', HttpStatus.UNAUTHORIZED);
        }

        const funkcije = new Funkcije()

        const jwtData = new JwtDataDto()
        jwtData.role = jwtRefreshData.role;
        jwtData.id = jwtRefreshData.id;
        jwtData.identitet = jwtRefreshData.identitet;
        jwtData.exp = funkcije.getDatePlus(60 * 10);
        jwtData.ip = jwtRefreshData.ip;
        jwtData.ua = jwtRefreshData.ua;

        const token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);

        const responseObject = new LoginInfoDto(
            jwtData.id,
            jwtData.identitet,
            token,
            data.token,
            funkcije.getIsoDate(jwtRefreshData.exp),
        )

        return responseObject;
     }
 

    //http://localhost:3000/auth/ucenik/login
    @Post('ucenik/login')
    async doUcenikLogin(@Body() data: LoginUcenikDto, @Req() req: Request): Promise<LoginInfoDto | ApiResponse> {
        const ucenik: Ucenik = await this.ucenikService.getByEmail(data.email);

        if(!ucenik) {
            return new Promise(resolve => {
                resolve(new ApiResponse('Greška!', -3001, 'Nije pronađen učenik'))
            }) 
        }

        const funkcije = new Funkcije()
        
        const passwordHash = crypto.createHash('sha512'); 
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        if (ucenik.passwordHash !== passwordHashString) {
            return new Promise(resolve => {
                resolve(new ApiResponse('Greška!', -3002, 'Nije pronađen učenik'))
            }) 
        }

        const jwtData = new JwtDataDto()
        jwtData.role = "ucenik"
        jwtData.id = ucenik.ucenikId;
        jwtData.identitet = ucenik.email
        jwtData.exp = funkcije.getDatePlus(60 * 10);
        jwtData.ip = req.ip
        jwtData.ua = req.headers['user-agent']

        const token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);

        const responseObject = new LoginInfoDto(
            ucenik.ucenikId,
            ucenik.passwordHash,
            token,
            '',
            '',
        )

        return new Promise(resolve => resolve(responseObject))
    }
}