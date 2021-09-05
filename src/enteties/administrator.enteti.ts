/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Administrator {
@PrimaryGeneratedColumn({
    type: 'int',
    name: 'administrator_id',
    unsigned: true,
})
administratorId: number;

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