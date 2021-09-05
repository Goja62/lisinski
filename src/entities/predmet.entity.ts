/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Nastavnik } from "./nastavnik.entity";

@Entity("predmet")
export class Predmet {
  @PrimaryGeneratedColumn({ 
    type: "int", 
    name: "predmet_id", 
    unsigned: true 
  })
  predmetId: number;

  @Column({
    type: "varchar",
    length: 128,
  })
  naziv: string;

  @Column({ 
    type: "text",
    name: "napomena_predmet"
  })
  napomenaPredmet: string;

  @OneToMany(
    () => Nastavnik, (nastavnik) => nastavnik.predmet
  )
  nastavniks: Nastavnik[];
}
