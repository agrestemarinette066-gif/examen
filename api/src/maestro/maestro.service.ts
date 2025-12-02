import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Maestro } from './entities/maestro.entity';
import { Curso } from './entities/curso.entity';
import { Examen } from './entities/examen.entity';
import { CreateMaestroDto } from './dto/create-maestro.dto';
import { UpdateMaestroDto } from './dto/update-maestro.dto';
import { CreateCursoDto } from './dto/create-curso.dto';
import { CreateExamenDto } from './dto/create-examen.dto';
import { NivelAcademico } from './enum/nivel-academico.enum';
import { TipoExamen } from './enum/tipo-examen.enum';

@Injectable()
export class MaestrosService {
    constructor(
        @InjectRepository(Maestro, "conexion-postgres-maestro")
        private readonly repoMaestro: Repository<Maestro>,
        @InjectRepository(Curso, "conexion-postgres-maestro")
        private readonly repoCurso: Repository<Curso>,
        @InjectRepository(Examen, "conexion-postgres-maestro")
        private readonly repoExamen: Repository<Examen>,
    ){}

    private convertirFecha(fecha:string):Date {
        const [ day, month, year ] = fecha.split("/").map(Number);
        return new Date( year, month -1, day );
    }

    async createCurso(data: CreateCursoDto) {
        let maestro;

        //delete data.id_maestro;

        const curso = this.repoCurso.create({
            maestro,
            ...data 
        });

        return await this.repoCurso.save( curso );
    }

    async createExamen(data: CreateExamenDto) {
        const curso = await this.repoCurso.findOne({
            where: { id_curso: data.id_curso },
            relations: ['maestro']
        });

        if (!curso) throw new NotFoundException("Curso no encontrado");

        const maestro = curso.maestro;
        
       // delete data.id_curso;

        const examen = this.repoExamen.create({
            curso,
            maestro,
            ...data 
        });

        return await this.repoExamen.save( examen );
    }

    async createMaestro(data: CreateMaestroDto) {
        const maestro = this.repoMaestro.create( data );
        return await this.repoMaestro.save( maestro );
    }

    async findAllMaestro(pagina: number = 1, limite: number = 10, urlBase: string) {

        const [datos, total] = await this.repoMaestro
            .createQueryBuilder("m")
            .skip( (pagina - 1) * limite )
            .take(limite)
            .orderBy("m.id_maestro", "ASC")
            .getManyAndCount();

        for (const maestro of datos) {
            maestro.cursos = await this.repoCurso
                .createQueryBuilder("c")
                .where("c.id_maestro = :id", { id: maestro.id_maestro })
                .orderBy("c.id_curso", "ASC")
                .limit(5)
                .getMany();

            maestro.examenes = await this.repoExamen
                .createQueryBuilder("e")
                .where("e.id_maestro = :id", { id: maestro.id_maestro })
                .orderBy("e.fecha", "DESC")
                .limit(5)
                .getMany();
        }

        const totalPaginas = Math.ceil( total/limite );

        const siguiente = (pagina < totalPaginas)
            ? `${urlBase}?pagina=${Number(pagina) + 1}&limite=${limite}`
            : null;

        const anterior = (pagina > 1)
            ? `${urlBase}?pagina=${Number(pagina) - 1}&limite=${limite}`
            : null;

        return {
            total,
            totalPaginas,
            anterior,
            siguiente,
            pagina,
            limite,
            datos,
        };
    }

    async findOneMaestro(id_maestro: number) {
        const maestro = await this.repoMaestro.findOne({
            where: { id_maestro },
            relations: [ "cursos", "examenes" ]
        });
        if(!maestro) throw new NotFoundException("Maestro no encontrado");
        return maestro;
    }

    async updateMaestro(id_maestro: number, data: UpdateMaestroDto) {
        return await this.repoMaestro.update(id_maestro, data);
    }

    async removeMaestro(id_maestro: number) {
        return await this.repoMaestro.delete(id_maestro);
    }

    async listarPorArea(area: string) {
        return await this.repoMaestro
            .createQueryBuilder("m")
            .where("m.area = :area", { area })
            .orderBy("m.apellido", "ASC")
            .getMany();
    }

    async cursosPorMaestro(id_maestro: number) {
        return await this.repoCurso
            .createQueryBuilder("c")
            .leftJoinAndSelect("c.maestro", "m")
            .where("c.id_maestro = :id", { id: id_maestro })
            .orderBy("c.nombre", "ASC")
            .getMany();
    }

    async examenesParcial() {
        return await this.repoExamen
            .createQueryBuilder("e")
            .leftJoinAndSelect("e.curso", "c")
            .where("e.tipo = :tipo", { tipo: TipoExamen.PARCIAL })
            .orderBy("e.fecha", "DESC")
            .getMany();
    }

    async examenesPorFecha(fecha: string) {
        const fechaConvertida = this.convertirFecha(fecha);
        return await this.repoExamen
            .createQueryBuilder("e")
            .leftJoinAndSelect("e.curso", "c")
            .leftJoinAndSelect("c.maestro", "m")
            .where("DATE(e.fecha) = DATE(:fecha)", { fecha: fechaConvertida })
            .orderBy("e.fecha", "ASC")
            .getMany();
    }

    async contarExamenesCurso(id_curso: number) {
        const curso = await this.repoCurso.findOne({
            where: { id_curso },
            relations: ['examenes']
        });

        if (!curso) throw new NotFoundException("Curso no encontrado");

        return {
            id_curso: curso.id_curso,
            nombre_curso: curso.nombre,
            total_examenes: curso.examenes?.length || 0,
            examenes: curso.examenes
        };
    }

    async cursosPorGrupo(grupo: string) {
        return await this.repoCurso
            .createQueryBuilder("c")
            .leftJoinAndSelect("c.maestro", "m")
            .where("c.grupo = :grupo", { grupo })
            .orderBy("c.nombre", "ASC")
            .getMany();
    }


    async maestrosDoctorado() {
        return await this.repoMaestro
            .createQueryBuilder("m")
            .where("m.nivel_academico = :nivel", { nivel: NivelAcademico.DOCTORADO })
            .orderBy("m.apellido", "ASC")
            .getMany();
    }


    async cursosConExamenes() {
        return await this.repoCurso
            .createQueryBuilder("c")
            .leftJoinAndSelect("c.maestro", "m")
            .leftJoinAndSelect("c.examenes", "e")
            .orderBy("c.nombre", "ASC")
            .addOrderBy("e.fecha", "DESC")
            .getMany();
    }

    async obtenerPromedioCurso(id_curso: number) {
        const resultado = await this.repoExamen
            .createQueryBuilder("e")
            .select("AVG(e.promedio)", "promedio_general")
            .where("e.id_curso = :id", { id: id_curso })
            .andWhere("e.promedio IS NOT NULL")
            .getRawOne();

        const curso = await this.repoCurso.findOne({
            where: { id_curso },
            relations: ['maestro']
        });

        if (!curso) throw new NotFoundException("Curso no encontrado");

        return {
            id_curso: curso.id_curso,
            nombre_curso: curso.nombre,
            maestro: `${curso.maestro.nombre} ${curso.maestro.apellido}`,
            promedio_general: resultado?.promedio_general || 0
        };
    }

    async agregarCursoAMaestro(id_maestro: number, cursoData: CreateCursoDto) {
        const maestro = await this.findOneMaestro(id_maestro);
        
        const curso = this.repoCurso.create({
            ...cursoData,
            maestro
        });

        return await this.repoCurso.save(curso);
    }

    async agregarExamenACurso(id_curso: number, examenData: CreateExamenDto) {
        const curso = await this.repoCurso.findOne({
            where: { id_curso },
            relations: ['maestro']
        });

        if (!curso) throw new NotFoundException("Curso no encontrado");

        const examen = this.repoExamen.create({
            ...examenData,
            curso,
            maestro: curso.maestro
        });

        return await this.repoExamen.save(examen);
    }
}