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
}