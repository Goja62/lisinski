/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Nastavnik } from "./nastavnik.entity";

@Entity("odsek")
export class Odsek {
  @PrimaryGeneratedColumn({ 
    type: "int",
    name: "odsek_id",
    unsigned: true 
  })
  odsekId: number;

  @Column({ 
    type: "varchar",
    name: "naziv_odseka",
    length: 50,
  })
  nazivOdseka: string;

  @OneToMany(
    () => Nastavnik, (nastavnik) => nastavnik.odsek
  )
  nastavniks: Nastavnik[];
}
