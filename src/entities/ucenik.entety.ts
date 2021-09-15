/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { NivoSkolovanja } from "./nivo-skolovanja.entety";

@Index("fk_ucenik_nivo_skolovanja_id", ["nivoSkolovanjaId"], {})
@Entity("ucenik", { schema: "onolisinski" })
export class Ucenik {
  @PrimaryGeneratedColumn({ type: "int", name: "ucenik_id", unsigned: true })
  ucenikId: number;

  @Column("varchar", { name: "prezime", length: 50, default: () => "'0'" })
  prezime: string;

  @Column("varchar", { name: "ime", length: 50, default: () => "'0'" })
  ime: string;

  @Column("int", {
    name: "nivo_skolovanja_id",
    unsigned: true,
    default: () => "'0'",
  })
  nivoSkolovanjaId: number;

  @ManyToOne(() => NivoSkolovanja, (nivoSkolovanja) => nivoSkolovanja.ucenici, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "nivo_skolovanja_id", referencedColumnName: "nivoSkolovanjaId" },
  ])
  nivoSkolovanja: NivoSkolovanja;
}