/* eslint-disable prettier/prettier */
export class AddNastavnikDto {
    email: string;
    password: string;
    prezime: string;
    ime: string;
    telefon: string;
    napomenaNastavnik: string;
    predmeti: {
        nazivPredmeta: string;
        napomenaPredmet: string;
    }[]
}