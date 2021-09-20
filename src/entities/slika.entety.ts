/* eslint-disable prettier/prettier */
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { Nastavnik } from "./nastavnik.entety";
  
  @Index("fk_slika_nastavnik_id", ["nastavnikId"], {})
  
  @Entity("slika")
  export class Slika {
    @PrimaryGeneratedColumn({ 
        type: "int", 
        name: "slika_id", 
        unsigned: true 
    })
    slikaId: number;
  
    @Column({ 
        type: "varchar", 
        length: 128
    })
    putanja: string
    
    @Column({ 
        type: "int", 
        name: "nastavnik_id",
        nullable: true,
        unsigned: true,
    })
    nastavnikId: number;
    
    @OneToOne(
      () => Nastavnik, (nastavnik) => nastavnik.slike, { onDelete: "RESTRICT",  onUpdate: "CASCADE", })
    @JoinColumn([{ name: "nastavnik_id", referencedColumnName: "nastavnikId" }])
    nastavnik: Nastavnik;
  }
  