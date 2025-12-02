import { 
    IsString,
    MaxLength,
    MinLength,
    IsOptional,
    IsPositive,
    IsNotEmpty,
    IsNumber
} from "class-validator";
import { Type } from "class-transformer";
import { Maestro } from "../entities/maestro.entity";
import { Examen } from "../entities/examen.entity";

export class CreateCursoDto {
    
    @IsNumber()
    @IsPositive()
    id_curso: number;

    @IsNumber()
    @IsPositive()
    id_maestro: number;

    @IsString()
    @MinLength(3)
    @MaxLength(255)
    nombre:         string;

    @IsString() 
    @MinLength(2) 
    @MaxLength(10)
    clave: string


    @IsString()
    @MinLength(1)
    @MaxLength(10)
    @IsOptional()
    grupo: string


    @IsString() 
    @MaxLength (100) 
    @IsOptional()
    horario: string;


    @IsString()
    @MaxLength (50)
    @IsOptional()
    salon: string;


    @Type(() => Maestro)
    @IsOptional() 
    maestro?: Maestro;


    @Type(() => Examen)
    @IsOptional() 
    examenes?: Examen []


}
