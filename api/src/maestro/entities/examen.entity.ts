import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Curso } from "./curso.entity";
import { Maestro } from "./maestro.entity";
import { TipoExamen } from "../enum/tipo-examen.enum";


@Entity("Examen")
export class Examen{
    @PrimaryGeneratedColumn({ name: "id_examen" })
    id_examen: number;

    @ManyToOne(() => Curso, (curso) => curso.examenes) 
    @JoinColumn({ name: "id_curso" })
    curso: Curso;

    @ManyToOne(() => Maestro, (maestro) => maestro.examenes)
    @JoinColumn({ name: "id_maestro" })
    maestro: Maestro;

    @Column({ type: "enum", enum: TipoExamen, default: TipoExamen. PARCIAL })
    tipo: TipoExamen;

    @Column({ type: "date" })
    fecha: Date;

    @Column({ type: "float", nullable: true })
    promedio: number;

    @Column({ type: "text", nullable: true })
    comentarios: string;


}
