/* eslint-disable prettier/prettier */
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import * as Validator from "class-validator";

@Index("uq_administrator_username", ["username"], { unique: true })
@Entity("administrator")
export class Administrator {
@PrimaryGeneratedColumn({
    type: 'int',
    name: 'administrator_id',
    unsigned: true,
})
administratorId: number;

@Validator.IsNotEmpty()
@Validator.IsString()
@Validator.Length(4, 50)
@Column({
    type: 'varchar',
    length: 50,
})
username: string;

@Column({
    type: 'varchar',
    name: 'password_hash',
    length: 128
})
passwordHash: string
}
