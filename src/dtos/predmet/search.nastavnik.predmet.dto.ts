/* eslint-disable prettier/prettier */
import * as Validator from "class-validator";

export class SearchNastavnikPredmetDto {
    nastavnikId: number;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    predmeti: string[];

    @Validator.IsNotEmpty()
    @Validator.IsString()
    prezimena: string[];
}