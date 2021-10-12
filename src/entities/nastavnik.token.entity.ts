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
  
  @Index("fk_nastavnik_token_nastavnik_id", ["nastavnikId"], {})
  
  @Entity("nastavnik_token")
  export class NastavnikToken {
    @PrimaryGeneratedColumn({ 
        type: "int", 
        name: "nastavnik_token_id", 
        unsigned: true 
    })
    nastavnikTokenId: number;
  
    @Column({ 
        type: "int",
        name: "nastavnik_id",
        unsigned: true,
    })
    nastavnikId: number;
  
    @Column({ 
        type: "timestamp",
        name: "created_at",
    })
    createdAt: string;
  
    @Column({
        type: "text",
    })
    token: string

    @Column({
        type: "datetime",
        name: "datum_isteka",
    })
    datumIsteka: string

    @Column({
        type: "tinyint",
        name: "is_valid",
        default: 1,
    })
    isValid: number
    
    @ManyToOne(
      () => Nastavnik, (nastavnik) => nastavnik.nastavnikTokeni, { onDelete: "RESTRICT",  onUpdate: "CASCADE", })
    @JoinColumn([{ name: "nastavnik_id", referencedColumnName: "nastavnikId" }])
    nastavnik: Nastavnik;
    
  }
  
  