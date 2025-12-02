import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query, Req } from '@nestjs/common';
import { MaestrosService } from './maestro.service';
import { CreateMaestroDto } from './dto/create-maestro.dto';
import { UpdateMaestroDto } from './dto/update-maestro.dto';
import * as express from 'express';
import { CreateCursoDto } from './dto/create-curso.dto';
import { CreateExamenDto } from './dto/create-examen.dto';

@Controller('maestros')
export class MaestrosController {
    constructor(private readonly maestrosService: MaestrosService) {}

    @Post()
    createMaestro(@Body( new ValidationPipe() ) data: CreateMaestroDto) {
        return this.maestrosService.createMaestro(data);
    }

    @Post("create-curso")
    curso(@Body( new ValidationPipe() ) data: CreateCursoDto) {
        return this.maestrosService.createCurso(data);
    }

    @Post("create-examen")
    examen(@Body( new ValidationPipe() ) data: CreateExamenDto) {
        return this.maestrosService.createExamen(data);
    }

    @Get("listar-por-area")
    async listarPorArea(@Query('area') area: string) {
        return this.maestrosService.listarPorArea(area);
    }

    @Get("cursos-maestro/:id_maestro")
    async cursosPorMaestro(@Param('id_maestro') id_maestro: number) {
        return this.maestrosService.cursosPorMaestro(id_maestro);
    }

    @Get("examenes-parcial")
    async examenesParcial() {
        return this.maestrosService.examenesParcial();
    }

    @Get("examenes-fecha")
    async examenesPorFecha(@Query('fecha') fecha: string) {
        return this.maestrosService.examenesPorFecha(fecha);
    }

    @Get("contar-examenes-curso/:id_curso")
    async contarExamenesCurso(@Param('id_curso') id_curso: number) {
        return this.maestrosService.contarExamenesCurso(id_curso);
    }

    @Get("cursos-grupo")
    async cursosPorGrupo(@Query('grupo') grupo: string) {
        return this.maestrosService.cursosPorGrupo(grupo);
    }

    @Get("maestros-doctorado")
    async maestrosDoctorado() {
        return this.maestrosService.maestrosDoctorado();
    }

    @Get("cursos-examenes")
    async cursosConExamenes() {
        return this.maestrosService.cursosConExamenes();
    }

    @Get()
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Req() req: express.Request
    ) {
        const baseUrl = `${req.protocol}://${req.host}${req.baseUrl}/api/dsm43/maestros`;

        return this.maestrosService.findAllMaestro(Number(page), Number(limit), baseUrl);
    }

    @Get(':id_maestro')
    findOne(@Param('id_maestro') id_maestro: number) {
        return this.maestrosService.findOneMaestro(id_maestro);
    }

    @Patch(':id_maestro')
    update(@Param('id_maestro') id_maestro: number, @Body( new ValidationPipe() ) data: UpdateMaestroDto) {
        return this.maestrosService.updateMaestro(id_maestro, data);
    }

    @Delete(':id_maestro')
    remove(@Param('id_maestro') id_maestro: number) {
        return this.maestrosService.removeMaestro(id_maestro);
    }
}