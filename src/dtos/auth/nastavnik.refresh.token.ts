/* eslint-disable prettier/prettier */
import * as Validator from "class-validator";

export class NastavnikRefreshTokenDto {
    @Validator.IsNotEmpty()
    @Validator.IsString()
    token: string
}