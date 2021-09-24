/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Req } from "@nestjs/common";
import { LoginAdministratorDto } from "src/dtos/administrator/login.administrator.dto";
import { Administrator } from "src/entities/administrator.entety";
import { ApiResponse } from "src/misc/api.response";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as crypto from 'crypto' 
import { LoginInfoAdministratorDto } from "src/dtos/administrator/login.info.administrator.dto";
import * as jwt from "jsonwebtoken"
import { JwtDataAdministratorDto } from "src/dtos/administrator/jwt.data.administrator.dto";
import { Request } from "express";
import { JwtSecret } from "config/jwt.secret";
import { NastavnikService } from "src/services/nastavnik/nastavnik.service";

@Controller('auth')
export class AuthController {
    constructor(
        public administratorService: AdministratorService,
        public nastavnikService: NastavnikService,
    ) { }

    //http://localhost:3000/auth/login
    @Post('login')
    async doLogin(@Body() data: LoginAdministratorDto, @Req() req: Request): Promise<LoginInfoAdministratorDto | ApiResponse> {
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

        const jwtData = new JwtDataAdministratorDto()
        jwtData.adminstratorId = administrator.administratorId;
        jwtData.username = administrator.username

        const sada = new Date();
        sada.setDate(sada.getDate() + 14)
        const istekTimeStamp = sada.getTime() / 1000
        jwtData.exp = istekTimeStamp
        jwtData.ip = req.ip
        jwtData.ua = req.headers['user-agent']

        const token: string = jwt.sign(jwtData.toPlainObject(), JwtSecret);

        const responseObject = new LoginInfoAdministratorDto(
            administrator.administratorId,
            administrator.passwordHash,
            token,
        )

        return new Promise(resolve => resolve(responseObject))
    }
}