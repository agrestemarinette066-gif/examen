import { Entity, Column, PrimaryGeneratedColumn, ManyToOne,OneToMany, JoinColumn } from "typeorm";
import { Maestro } from "./maestro.entity";
import { Examen } from "./examen.entity";


@Entity('Curso')
export class Curso {
    @PrimaryGeneratedColumn({ name: "id_curso" })
    id_curso: number;

    @ManyToOne(() => Maestro, (maestro) => maestro.cursos)
    @JoinColumn({ name: "id_maestro" })
    maestro: Maestro;

    @OneToMany(() => Examen, (examen) => examen.curso, { eager: false })
    @JoinColumn({ name: "id_curso" })
    examenes: Examen [];

    @Column() 
    nombre: string;

    @Column()
    clave: string

    @Column()
    grupo: string;

    @Column() 
    horario: string;

    @Column()
    salon: string;

}
