/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Ucenik } from "./ucenik.entety";

@Entity("nivo_skolovanja", { schema: "onolisinski" })
export class NivoSkolovanja {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "nivo_skolovanja_id",
    unsigned: true,
  })
  nivoSkolovanjaId: number;

  @Column("varchar", { name: "naziv", length: 3, default: () => "'0'" })
  naziv: string;

  @OneToMany(() => Ucenik, (ucenik) => ucenik.nivoSkolovanja)
  ucenici: Ucenik[];
}
