/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as jwt from 'jsonwebtoken'
import { JwtDataDto } from "src/dtos/auth/jwt.data.dto";
import { jwtSecret } from "config/jwt.secret";
import { NastavnikService } from "src/services/nastavnik/nastavnik.service";
import { UcenikService } from "src/services/ucenik/ucenik.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly administratorService: AdministratorService,
        private readonly nastavnikService: NastavnikService,
        private readonly ucenikService: UcenikService,
    ) { }

    
    async use(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            throw new HttpException('Token nije proneđen', HttpStatus.UNAUTHORIZED);
        }

        const token = req.headers.authorization;

        const deloviTokena = token.split(' ');
        if (deloviTokena.length !== 2) {
            throw new HttpException('Pronađen je neispravan token', HttpStatus.UNAUTHORIZED);
        }

        const tokenString = deloviTokena[1];

        let jwtData: JwtDataDto;
        
        try {
            jwtData = jwt.verify(tokenString, jwtSecret);
        } catch (e) {
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }
        
        if (!jwtData) {
            throw new HttpException('Pronađen je neispravan token', HttpStatus.UNAUTHORIZED);
        }

        if (jwtData.ip !== req.ip.toString()) {
            throw new HttpException('IP adresa nije pronađena', HttpStatus.UNAUTHORIZED);
        }

        if (jwtData.ua !== req.headers['user-agent']) {
            throw new HttpException('User agent nije pronađen', HttpStatus.UNAUTHORIZED);
        }
        
        
        switch (jwtData.role) {
            case "administrator":
                const administrator = await this.administratorService.getById(jwtData.id)
                if (!administrator) {
                    throw new HttpException('Administrator nije pronađen', HttpStatus.UNAUTHORIZED);
                }
                break;

            case "nastavnik":
                const nastavnik = await this.nastavnikService.getById(jwtData.id)
                if (!nastavnik) {
                    throw new HttpException('Nastavnik nije pronađen', HttpStatus.UNAUTHORIZED);
                }
                break;
            
            case "ucenik":
                const ucenik = await this.ucenikService.getById(jwtData.id)
                if (!ucenik) {
                    throw new HttpException('Ucenik nije pronađen', HttpStatus.UNAUTHORIZED);
                }
                break;
        }

        const trenutniTimestamp = new Date().getTime() / 1000;
        if (trenutniTimestamp >= jwtData.exp) {
            throw new HttpException('Validnost tokena je istekla', HttpStatus.UNAUTHORIZED);
        }

        req.token = jwtData;

        next();
    }
    
}