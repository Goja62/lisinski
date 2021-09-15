/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Nastavnik } from "./nastavnik.entety";

@Index("fk_predmet_nastavnik_id", ["nastavnikId"], {})

@Entity("predmet", { schema: "onolisinski" })
export class Predmet {
  @PrimaryGeneratedColumn({ type: "int", name: "predmet_id", unsigned: true })
  predmetId: number;

  @Column("varchar", { name: "naziv", length: 128, default: () => "'0'" })
  naziv: string;

  @Column("int", { name: "nastavnik_id", unsigned: true, default: () => "'0'" })
  nastavnikId: number;

  @Column("text", { name: "napomena_predmet" })
  napomenaPredmet: string;

  @Column("int", { name: "ucenik_id", unsigned: true, default: () => "'0'" })
  ucenikId: number;

  
  @ManyToOne(
    () => Nastavnik, (nastavnik) => nastavnik.predmeti, { onDelete: "RESTRICT",  onUpdate: "CASCADE", })
  @JoinColumn([{ name: "nastavnik_id", referencedColumnName: "nastavnikId" }])
  nastavnik: Nastavnik;
}
