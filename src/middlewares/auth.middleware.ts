/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as jwt from 'jsonwebtoken'
import { JwtDataAdministratorDto } from "src/dtos/administrator/jwt.data.administrator.dto";
import { JwtSecret } from "config/jwt.secret";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly administratorService: AdministratorService) { }

    
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

        const jwtData: JwtDataAdministratorDto = jwt.verify(tokenString, JwtSecret)
        
        if (!jwtData) {
            throw new HttpException('Pronađen je neispravan token', HttpStatus.UNAUTHORIZED);
        }

        if (jwtData.ip !== req.ip.toString()) {
            throw new HttpException('IP adresa nije pronađena', HttpStatus.UNAUTHORIZED);
        }

        if (jwtData.ua !== req.headers['user-agent']) {
            throw new HttpException('User agent nije pronađen', HttpStatus.UNAUTHORIZED);
        }
        
        const administrator = await this.administratorService.getById(jwtData.adminstratorId)
        if (!administrator) {
            throw new HttpException('Administrator nije pronađen', HttpStatus.UNAUTHORIZED);
        }

        const trenutniTimestamp = new Date().getTime() / 1000;
        if (trenutniTimestamp >= jwtData.exp) {
            throw new HttpException('Validnost tokena je istekla', HttpStatus.UNAUTHORIZED);
        }

        next();
    }
    
}