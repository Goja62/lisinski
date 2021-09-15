/* eslint-disable prettier/prettier */
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Nastavnik } from "./nastavnik.entety";

@Index("fk_odsek_nastavnik_id", ["nastavnikId"], {})
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

  @Column({ 
    type: "text",
    name: "napomena_odsek",
  })
  napomenaOdsek: string;

  @Column("int", {
    name: "nastavnik_id",
    nullable: true,
    unsigned: true,
  })
  nastavnikId: number | null;

  @ManyToOne(
    () => Nastavnik, (nastavnik) => nastavnik.odseci, { onDelete: "RESTRICT", onUpdate: "CASCADE",})
  @JoinColumn([{ name: "nastavnik_id", referencedColumnName: "nastavnikId" }])
  nastavnik: Nastavnik;
}
