import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaestroModule } from './maestro/maestro.module';
import { Maestro} from './maestro/entities/maestro.entity';
import { Curso } from './maestro/entities/curso.entity';
import { Examen } from  './maestro/entities/examen.entity';

@Module({
  imports: [
   TypeOrmModule.forRoot({
        name: "conexion-postgres-maestro",
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "pass",
        database: "maestro",
        entities: [ Curso, Examen, Maestro ],
        synchronize: true,
        autoLoadEntities: true,
    }),
    MaestroModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
