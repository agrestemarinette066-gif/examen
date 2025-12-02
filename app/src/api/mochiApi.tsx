import axios from 'axios';

const baseURL = 'http://localhost:3000/api';

const mochiApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

mochiApi.interceptors.request.use((config) => {
  console.log('Request:', config.method?.toUpperCase(), config.url);
  return config;
});

mochiApi.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const maestrosApi = {
  crear: (data: any) => mochiApi.post('/maestros', data),
  obtenerTodos: (pagina = 1, limite = 10) => 
    mochiApi.get(`/maestros?pagina=${pagina}&limite=${limite}`),
  obtenerPorId: (id: number) => mochiApi.get(`/maestros/${id}`),
  actualizar: (id: number, data: any) => mochiApi.patch(`/maestros/${id}`, data),
  eliminar: (id: number) => mochiApi.delete(`/maestros/${id}`),
};

export const cursosApi = {
  crear: (data: any) => mochiApi.post('/maestros/create-curso', data),
  obtenerTodos: () => mochiApi.get('/maestros/cursos-examenes'),
};

export const examenesApi = {
  crear: (data: any) => mochiApi.post('/maestros/create-examen', data),
  obtenerParciales: () => mochiApi.get('/maestros/examenes-parcial'),
};

export const consultasApi = {
  listarPorArea: (area: string) => 
    mochiApi.get(`/maestros/listar-por-area?area=${area}`),
  
  cursosPorMaestro: (idMaestro: number) => 
    mochiApi.get(`/maestros/cursos-maestro/${idMaestro}`),
  
  examenesParcial: () => mochiApi.get('/maestros/examenes-parcial'),
  
  examenesPorFecha: (fecha: string) => 
    mochiApi.get(`/maestros/examenes-fecha?fecha=${fecha}`),
  
  contarExamenesCurso: (idCurso: number) => 
    mochiApi.get(`/maestros/contar-examenes-curso/${idCurso}`),
  
  cursosPorGrupo: (grupo: string) => 
    mochiApi.get(`/maestros/cursos-grupo?grupo=${grupo}`),
  
  maestrosDoctorado: () => mochiApi.get('/maestros/maestros-doctorado'),
  
  cursosConExamenes: () => mochiApi.get('/maestros/cursos-examenes'),
};

export const AREAS = [
  'matematicas',
  'ciencias', 
  'humanidades',
  'tecnologia',
  'artes'
];

export const NIVELES_ACADEMICOS = [
  'licenciatura',
  'maestria',
  'doctorado',
  'especializacion'
];

export const TIPOS_EXAMEN = [
  'parcial',
  'final',
  'extraordinario'
];

export const sistemaApi = {
  crearMaestro: (data: any) => mochiApi.post('/maestros', data),
};

export default mochiApi;