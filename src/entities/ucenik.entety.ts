/* eslint-disable prettier/prettier */
import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
  } from "typeorm";
import { NivoSkolovanja } from "./nivo-skolovanja.entety";
  
  @Entity("ucenik")
  export class Ucenik {
    @PrimaryGeneratedColumn({ 
      type: "int", 
      name: "ucenik_id", 
      unsigned: true 
    })
    ucenikId: number;
  
    @Column({ 
      type: "varchar",
      length: 50,
    })
    prezime: string;
  
    @Column({ 
      type: "varchar",
      length: 50,
    })
    ime: string;

    @Column({ 
      type: "text",
      name: "nivo_skolovanja_id", 
      nullable: true 
    })
    nivoSkolovanjaId: number;
  
    @OneToMany(
      () => NivoSkolovanja, (nivoSkolovanja) => nivoSkolovanja.ucenik
    )
    nivoiSkolovanja: NivoSkolovanja[];
  }
  