/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Odsek } from "./odsek.entity";
import { Predmet } from "./predmet.entity";

@Index("uq_nastavnik_e-mail", ["email"], { unique: true })
@Index("uq_nastavnik_telefon", ["telefon"], { unique: true })
@Index("fk_nastavnik_predmet_id", ["predmetId"], {})
@Index("fk_nastavnik_odsek_id", ["odsekId"], {})
@Entity("nastavnik", { schema: "onolisinski" })
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
    type: "int",
    name: "predmet_id", 
  })
  predmetId: number;

  @Column({ 
    type: "int", 
    name: "odsek_id", 
    unsigned: true,
  })
  odsekId: number;

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

  @ManyToOne(
    () => Odsek, (odsek) => odsek.nastavniks, { onDelete: "RESTRICT", onUpdate: "CASCADE", })
  @JoinColumn([{ name: "odsek_id", referencedColumnName: "odsekId" }]
  )
  odsek: Odsek;

  @ManyToOne(
    () => Predmet, (predmet) => predmet.nastavniks, { onDelete: "RESTRICT", onUpdate: "CASCADE", })
  @JoinColumn([{ name: "predmet_id", referencedColumnName: "predmetId" }]
  )
  predmet: Predmet;
}
