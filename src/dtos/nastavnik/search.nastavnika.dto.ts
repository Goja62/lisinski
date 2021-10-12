/* eslint-disable prettier/prettier */
import { SearchNastavnikPredmetDto } from "../predmet/search.nastavnik.predmet.dto";

/* eslint-disable prettier/prettier */
export class SearchNastavnikDto {
    predmetId: number;
    nastavnikId: number;
    predmeti: SearchNastavnikPredmetDto[];
}