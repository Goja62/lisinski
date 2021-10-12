/* eslint-disable prettier/prettier */
import { SearchNastavnikPredmetDto } from "./search.nastavnik.predmet.dto";
import * as Validator from "class-validator";

export class SearchPredmetDto {
    predmetId: number;

    @Validator.IsOptional()
    @Validator.IsString()
    @Validator.Length(0, 128)
    keywords: string;

    @Validator.IsOptional()
    nastavnici: SearchNastavnikPredmetDto[];

    @Validator.IsOptional()
    @Validator.IsIn(['naziv', 'nastavnikId'])
    orderBy: 'naziv' | 'nastavnikId';

    @Validator.IsOptional()
    @Validator.IsIn(['ASC', 'DESC'])
    sort: 'ASC' | 'DESC';

    @Validator.IsOptional()
    @Validator.IsPositive()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 0,
    })


    @Validator.IsOptional()
    @Validator.IsPositive()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 0,
    })
    strane: number;

    @Validator.IsOptional()
    @Validator.IsPositive()
    @Validator.IsIn([5, 10, 25, 50, 75])
    zapisiPoStrani: 5 | 10 | 25 | 50 | 75;

    nastavnikId: number;
}