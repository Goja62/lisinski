/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Crud } from "@nestjsx/crud";
import { AddNastavnikDto } from "src/dtos/nastavnik/add.nastavnik.dto";
import { Nastavnik } from "src/entities/nastavnik.entety";
import { ApiResponse } from "src/misc/api.response";
import { NastavnikService } from "src/services/nastavnik/nastavnik.service";
import { diskStorage } from 'multer'
import { SkladisteConfig } from "config/skladiste.config";
import { SlikaService } from "src/services/slika/slika.service";
import { Slika } from "src/entities/slika.entety";
import * as fileType from "file-type";
import * as fs from "fs";
import { Funkcije } from "src/misc/funkcije";
import * as sharp from "sharp";
import { EditNastavnikDto } from "src/dtos/nastavnik/edit.nastavnik.dto";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";

//http://localhost:3000/api/nastavnik
@Controller('api/nastavnik')
@Crud({
    model: {
        type: Nastavnik
    },
    params: {
        id: {
            field: 'nastavnikId',
            type: 'number',
            primary: true
        }
    },
    query: {
        join: {
            predmeti: {
                eager: true,
            },
            odseci: {
                eager: true,
            },
            slike: {
                eager: true
            }
        }
    }
})
export class NastavnikController {
    constructor(
        public service: NastavnikService,
        public slikaService: SlikaService, 
    ) {}
    
    //http://localhost:3000/api/nastavnik/napraviNastavnika
    @Post('napraviNastavnika')
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('administrator')
    async PravljenjeKompletnogNastavnika(@Body() data: AddNastavnikDto): Promise<Nastavnik | ApiResponse> {
        return await this.service.PravljenjeKompletnogNastavnika(data)
    }

    @Patch(':nastavnikId')
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('administrator')
    async editovanjeKompletnogNastavnika(@Param('nastavnikId') id: number, @Body() data: EditNastavnikDto): Promise<Nastavnik | ApiResponse> {
        
        return await this.service.editovanjeKompletnogNastavnika(id, data)
    }

    //http://localhost:3000/api/nastavnik/:id
    @Get('/:id')
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('nastavnik', 'administrator')
    async getNastavnikById(@Param('id') nastavnikId: number): Promise<Nastavnik | ApiResponse> {
        return await this.service.getById(nastavnikId);
    }

     // http://localhost:3000/api/nastavnik/:id/uploadSlike/
    @Post(':id/uploadSlike')
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('administrator')
    @UseInterceptors(
        FileInterceptor('slika', {
            storage: diskStorage({
                destination: SkladisteConfig.slika.destinacija,
                // Ovo je inline array funkcja i mora da sadrži tri argumenta
                filename: (req, file, callback) => {
                    const original: string = file.originalname;
                    const normalizovano = original.replace(/\s+/g, '-');
                    normalizovano.replace(/[^A-z0-9\.\-]/g, '')
                    const sada = new Date();
                    let deloviDatuma = '';
                    deloviDatuma += sada.getFullYear();
                    deloviDatuma += (sada.getMonth() + 1);
                    deloviDatuma += sada.getDate().toString();

                    const nasumicniBroj: string = 
                    new Array(10)
                    .fill(0)
                    .map(e => (Math.random() * 9).toFixed(0).toString())
                    .join('')

                    let fileName = deloviDatuma + '-' + nasumicniBroj + '-' + normalizovano;

                    fileName = fileName.toLowerCase()

                    callback(null, fileName);
                }
            }),
            fileFilter: (req, file, callback) => {
                if (!file.originalname.match(/\.(jpg|png)$/)) {
                    req.fileFilterEror = 'Neispravna ekstenzija slike!'
                    callback(null, false);
                    return
                }

                if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
                    req.fileFilterEror = 'Slika nije tipa jpg ili png!'
                    callback(null, false)
                    return;
                }
                callback(null, true)
            },
            limits: {
                files: 1,
                fileSize: SkladisteConfig.slika.slikaMaksimalnaVelicina
            }
        })
    )
    
    async uploadSlike(@Param('id') nastavnikId: number, @UploadedFile() slika, @Req() req): Promise<Slika | ApiResponse> {
        if (req.fileFilterEror) {
            return new ApiResponse('error', - 4002, req.fileFilterEror)
        }

        if (!slika) {
            return new ApiResponse('error', - 4002, 'Slika nije sačuvana!')
        }
        

        const fileTypeRezultat = await fileType.fromFile(slika.path);
            if(!fileTypeRezultat) {
                // Mora se obristati dokument
                fs.unlinkSync(slika.path)
                return new ApiResponse('error', -4002, 'Ne može se prepoznati vrsta dokumenta!')
            }
           
            const praviMimetype = fileTypeRezultat.mime;
            if (!(praviMimetype.includes('jpeg') || praviMimetype.includes('png'))) {
                // Mora se obristati dokument
                fs.unlinkSync(slika.path)
                return new ApiResponse('error', -4002, 'Neispravna ekstenzija slike!')
            }

            const napraviThumb = new Funkcije()
            napraviThumb.napraviPromenjenuSliku(slika, SkladisteConfig.slika.promenaVelicine.thumb)

            const napraviMala = new Funkcije()
            napraviMala.napraviPromenjenuSliku(slika, SkladisteConfig.slika.promenaVelicine.mala)

        const novaSlika: Slika = new Slika()
        novaSlika.nastavnikId = nastavnikId;
        novaSlika.putanja = slika.filename;

        const sacuvanaSlika = await this.slikaService.dodavanjeSlike(novaSlika);

        if (!sacuvanaSlika) {
            return new ApiResponse('error', - 4001, "Slika nije sačuvana")
        }

        return sacuvanaSlika;
    }

    // http://localhost:3000/api/nastavnik/:nastavnikId/brisanjeSlike/:slikaId/
   @Delete(':nastavnikId/brisanjeSlike/:slikaId')
   @UseGuards(RoleCheckerGuard)
   @AllowToRoles('administrator')
   public async brisanjeSlike(@Param('nastavnikId') nastavnikId: number, @Param('slikaId') slikaId: number): Promise<Slika | ApiResponse> {
        const slika = await this.slikaService.findOne({
            nastavnikId: nastavnikId,
            slikaId: slikaId,
        })

        if (!slika) {
            return new ApiResponse('error', -5001, 'Fotografija nije pronađena')
        }

        fs.unlinkSync(SkladisteConfig.slika.destinacija + slika.putanja)
        fs.unlinkSync(SkladisteConfig.slika.destinacija +  SkladisteConfig.slika.promenaVelicine.mala.direktorijum + slika.putanja)
        fs.unlinkSync(SkladisteConfig.slika.destinacija +  SkladisteConfig.slika.promenaVelicine.thumb.direktorijum + slika.putanja)

        const rezultetBrisanja = await this.slikaService.brisanjeSlike(slika.slikaId)

        if (rezultetBrisanja.affected === 0) {
            return new ApiResponse('error', -5002, 'Nijedna slika nije obrisana')
        }

        return new ApiResponse('ok', 0, 'Obrisana je 1 slika')
   } 
}