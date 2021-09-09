/* eslint-disable prettier/prettier */
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Nastavnik } from "./nastavnik.entity";

@Entity("predmet")
export class Predmet {
  [x: string]: any;
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

  @ManyToOne(
    () => Nastavnik, (nastavnik) => nastavnik.predmeti, { onDelete: "RESTRICT", onUpdate: "CASCADE", })
  @JoinColumn([{ name: "nastavnik_id", referencedColumnName: "nastavnikId" }]
  )
  nastavnik: Nastavnik;
}
