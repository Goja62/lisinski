/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { NastavnikToken } from "./nastavnik.token.entity";
import { Odsek } from "./odsek.entity";
import { Predmet } from "./predmet.entity";
import { Slika } from "./slika.entety";

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

  @Column({ 
    type: "text",
    name: "napomena_nastavnik", 
    nullable: true 
  })
  napomenaNastavnik: string | null;

  @OneToMany(
    () => Odsek, (odsek) => odsek.nastavnik
  )
  odseci: Odsek[];

  @OneToMany(
    () => Predmet, (predmet) => predmet.nastavnik
    )
  predmeti: Predmet[];

  @OneToOne(
    () => Slika, (slika) => slika.nastavnik
    )
  slike: Slika[];

  @OneToMany(
    () => NastavnikToken, (nastavnikToken) => nastavnikToken.nastavnik
    )
  nastavnikTokeni: NastavnikToken[];
}
