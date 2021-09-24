/* eslint-disable prettier/prettier */
export class EditNastavnikDto {
    email: string;
    password: string;
    prezime: string;
    ime: string;
    telefon: string;
    napomenaNastavnik: string;
    ucenik: {
        ucenikId: number
    };
    predmeti: {
        nazivPredmeta: string;
        napomenaPredmet: string;
        ucenikId: number;
    }[] | null
}