import { Module } from '@nestjs/common';
import { MaestrosService } from './maestro.service';
import { MaestrosController } from './maestro.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Maestro } from './entities/maestro.entity';
import { Curso } from './entities/curso.entity';
import { Examen } from './entities/examen.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Maestro,
            Curso,
            Examen
        ],"conexion-postgres-maestro"),
    ],
    controllers: [MaestrosController],
    providers: [MaestrosService],
})
export class MaestroModule {}
