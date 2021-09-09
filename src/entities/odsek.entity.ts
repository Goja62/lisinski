/* eslint-disable prettier/prettier */
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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

  @ManyToOne(() => Nastavnik, (nastavnik) => nastavnik.odseci, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "nastavnik_id", referencedColumnName: "nastavnikId" }])
  nastavnik: Nastavnik;
}
