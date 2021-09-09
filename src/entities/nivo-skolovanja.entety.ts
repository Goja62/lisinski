/* eslint-disable prettier/prettier */
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Ucenik } from "./ucenik.entety";

@Entity("nivo_skolovanja")
export class NivoSkolovanja {
  @PrimaryGeneratedColumn({ 
    type: "int",
    name: "nivo_skolovanja_id",
    unsigned: true 
  })
  nivoSkolovanjaId: number;

  @Column({ 
    type: "varchar",
    length: 50,
  })
  naziv: string;

  @ManyToOne(
      () => Ucenik, (ucenik) => ucenik.nivoiSkolovanja, { onDelete: "RESTRICT", onUpdate: "CASCADE", })
  @JoinColumn([{ name: "nivo_skolovanja_id", referencedColumnName: "nivoSkolovanjaId" }]
  )
  ucenik: Ucenik;
}