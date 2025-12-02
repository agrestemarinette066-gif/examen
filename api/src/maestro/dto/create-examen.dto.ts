import { 
    IsString,
    IsOptional,
    IsEnum,
    IsPositive,
    IsNotEmpty,
    IsDateString,
    IsNumber
} from "class-validator";
import { Type } from "class-transformer";
import { Curso } from "../entities/curso.entity";
import { TipoExamen } from "../enum/tipo-examen.enum";

export class CreateExamenDto {
    
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    id_examen: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    id_curso: number;

    @IsEnum(TipoExamen)
    tipo: TipoExamen;

    @IsDateString()
    fecha: string;

    @IsNumber()
    @IsPositive()
    @IsOptional() 
    promedio: number;

    @IsString()
    @IsOptional()
    comentarios: string;

    @Type(() => Curso)
    @IsOptional()
    curso?: Curso;


}
