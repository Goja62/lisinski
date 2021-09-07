/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Odsek } from "./odsek.entity";
import { Predmet } from "./predmet.entity";

@Index("uq_nastavnik_e-mail", ["email"], { unique: true })
@Index("uq_nastavnik_telefon", ["telefon"], { unique: true })

@Entity("nastavnik")
export class Nastavnik {
  @PrimaryGeneratedColumn({ 
    type: "int", 
    name: "nastavnik_id", 
    unsigned: true 
  })
  nastavnikId: number;

  @Column({
    type: "varchar",
    unique: true,
    length: 50,
  })
  email: string;

  @Column({
    type: 'varchar',
    name: 'password_hash',
    length: 128
  })
  passwordHash: string

  @Column({ 
    type: "varchar",
    length: 50,
  })
  prezime: string;

  @Column({ 
    type: "varchar",
    length: 50,
  })
  ime: string;

  @Column({
    type: "varchar",
    unique: true,
    length: 50,
  })
  telefon: string;

  @OneToMany(
    () => Odsek, (odsek) => odsek.nastavnik
  )
  odseks: Odsek[];

  @OneToMany(
    () => Predmet, (predmet) => predmet.nastavnik
  )
  predmets: Predmet[];
}
