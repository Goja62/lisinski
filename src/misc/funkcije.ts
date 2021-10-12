/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { SkladisteConfig } from "config/skladiste.config";
import * as sharp from "sharp";

/* eslint-disable @typescript-eslint/no-empty-function */
export class Funkcije {

    async napraviPromenjenuSliku(slika, setovanjePromeneVelicine) {
        const originalnaPutanjaSlike = slika.path;
        const fileName = slika.filename;

        const odredistnaPutanajSlike = SkladisteConfig.slika.destinacija + setovanjePromeneVelicine.direktorijum + fileName

        await sharp(originalnaPutanjaSlike)
        .resize({
            fit: 'cover',
            width: setovanjePromeneVelicine.sirina,
            height: setovanjePromeneVelicine.visina,
        })
        .toFile(odredistnaPutanajSlike);
    }

    getDatePlus(brojSekundi: number) {
       return new Date().getTime() / 1000 + brojSekundi
    }

    getIsoDate(timestamp: number) {
        const date = new Date();
        date.setTime(timestamp * 1000);
        return date.toISOString();
    }

    getDatabseDateFormat(isoFormat: string): string {
        return isoFormat.substr(0, 19).replace('T', ' ');
    }
}