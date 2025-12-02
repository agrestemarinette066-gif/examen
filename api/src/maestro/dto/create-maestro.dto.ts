import { 
    IsString,
    MaxLength,
    MinLength,
    IsOptional,
    IsEnum,
    IsDateString,
    IsPositive,
    IsNotEmpty,
    IsNumber
} from "class-validator";
import { Type } from "class-transformer";
import { Curso } from "../entities/curso.entity";
import { Examen } from "../entities/examen.entity";
import { NivelAcademico } from "../enum/nivel-academico.enum";
import { Area } from "../enum/area_cono.enum";
;

export class CreateMaestroDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(255)
    nombre:         string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(255)
    apellido:     string;

    @IsNotEmpty()
    @IsString()
    @MinLength (5)
    @MaxLength(255)
    correo: string;

   
    @IsEnum( Area )
    @IsOptional()
    area:           Area;

    @IsEnum (NivelAcademico) 
    @IsOptional() 
    nivel_academico:  NivelAcademico;


    @IsDateString()
    @IsOptional() 
    fecha_ingreso: string;


    //*@Type(() => Curso)
    //@IsOptional() 
    //cursos?: Curso[];


   // @Type(() => Examen)
    //@IsOptional() 
    //examenes?: Examen []

}
