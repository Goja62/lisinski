/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { NivoSkolovanja } from "./nivo-skolovanja.entety";
import { Predmet } from "./predmet.entity";

@Index("fk_ucenik_nivo_skolovanja_id", ["nivoSkolovanjaId"], {})
@Index("uq_ucenik_emaill", ["email"], { unique: true })

@Entity("ucenik", { schema: "onolisinski" })
export class Ucenik {
  @PrimaryGeneratedColumn({ type: "int", name: "ucenik_id", unsigned: true })
  ucenikId: number;

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

  @OneToMany(
    () => Predmet, (predmet) => predmet.ucenik
    )
  predmeti: Predmet[];

  @ManyToOne(() => NivoSkolovanja, (nivoSkolovanja) => nivoSkolovanja.ucenici, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "nivo_skolovanja_id", referencedColumnName: "nivoSkolovanjaId" },
  ])
  nivoSkolovanja: NivoSkolovanja;
}