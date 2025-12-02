import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from "typeorm";
import { Area } from "../enum/area_cono.enum";
import { NivelAcademico } from "../enum/nivel-academico.enum";
import { Curso } from "./curso.entity";
import { Examen } from "./examen.entity";

@Entity("Maestro")
export class Maestro {
    @PrimaryGeneratedColumn({ name: "id_maestro" })
    id_maestro:    number;

    @OneToMany(() => Curso, (curso) => curso.maestro, { eager: false }) 
    @JoinColumn({ name: "id_maestro" }) 
    cursos: Curso[];

    @OneToMany(() => Examen, (examen) => examen.maestro, { eager: false }) @JoinColumn({ name: "id_maestro" })
    examenes: Examen[];


    @Column()
    nombre:         string;

    @Column()
    apellido:     string;

    @Column() 
    correo: string;

    
    @Column({ type: "enum", enum: Area, default: Area.MATEMATICAS })
    area:           Area;

    @Column({ type: "enum", enum: NivelAcademico, default: NivelAcademico. LICENCIATURA})
    nivel_academico: NivelAcademico


    @Column({ type: "date" })
    fecha_ingreso: Date;

}
