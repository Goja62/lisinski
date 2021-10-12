/* eslint-disable prettier/prettier */
import * as Validator from "class-validator";

export class LoginNastavnikDto {
    @Validator.IsNotEmpty()
    @Validator.IsEmail()
    @Validator.Length(10, 50)
    email: string;
    
    password: string;
}