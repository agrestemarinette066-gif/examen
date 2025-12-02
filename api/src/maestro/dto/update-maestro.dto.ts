import { 
    IsString,
    MaxLength,
    MinLength,
    IsOptional,
    IsDateString,
    IsEnum
} from "class-validator";
import { Curso } from "../entities/curso.entity";
import { Type } from "class-transformer";
import { Examen } from "../entities/examen.entity";
import { NivelAcademico } from "../enum/nivel-academico.enum";
import { Area } from "../enum/area_cono.enum";


export class UpdateMaestroDto {
    @IsString()
    @MinLength(3)
    @MaxLength(255)
    @IsOptional()
    nombre:         string;

    @IsString()
    @MinLength(3)
    @MaxLength(255)
    @IsOptional()
    apellido:     string;

    @IsString()
    @MinLength(5)
    @MaxLength(255)
    @IsOptional()
    correo: string

    @IsEnum( Area )
    @IsOptional()
    area:           Area;

    @IsEnum(NivelAcademico) 
    @IsOptional()
    nivel_academico: NivelAcademico

    @IsDateString()
    @IsOptional()
    fecha_ingreso: string;


    @Type(() => Curso)
    @IsOptional()
    cursos?: Curso[];


    @Type(() => Examen)
    @IsOptional()
    examenes?: Examen[];

}
