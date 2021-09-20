/* eslint-disable prettier/prettier */
export const SkladisteConfig = {
    slika: {
        destinacija: '../skladiste/slike/',
        slikaMaksimalnaVelicina: 1024 * 1024 * 100,
        promenaVelicine: {
            thumb: {
                sirina: 120, 
                visina: 100,
                direktorijum: 'thumb/'
            },
            mala: {
                sirina: 320, 
                visina: 240,
                direktorijum: 'mala/'
            }
        }
    }
}