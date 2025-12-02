const axios = require("axios");

// --- CONFIGURACIÓN ---
const API_BASE = "http://localhost:3000/api/dsm43"; 
const TOTAL_MAESTROS = 10; // Cambiado a 10 para una prueba rápida
const MAESTROS = []; // Almacena IDs de maestros creados
const CURSOS = []; // Almacena IDs de cursos creados

// --- CONSTANTES DE DATOS ---
const AREAS = ["MATEMATICAS", "FISICA", "QUIMICA", "BIOLOGIA", "INFORMATICA", "LENGUA"];
const NIVELES_ACADEMICOS = ["LICENCIATURA", "MAESTRIA", "DOCTORADO"];

const NOMBRES = [
    "Juan", "Carlos", "Luis", "Miguel", "Jose", "Jorge", "Felipe", "Hector",
    "Maria", "Ana", "Laura", "Patricia", "Carmen", "Isabel", "Sofia", "Lucia"
];

const APELLIDOS = [
    "Hernandez", "Martinez", "Gomez", "Perez", "Lopez", "Garcia",
    "Rodriguez", "Sanchez", "Ramirez", "Cruz", "Torres", "Rivera"
];

const CURSOS_DICT = {
    MATEMATICAS: ["Cálculo Avanzado", "Álgebra Lineal", "Geometría Analítica"],
    FISICA: ["Mecánica Cuántica", "Termodinámica", "Óptica"],
    QUIMICA: ["Química Orgánica", "Bioquímica", "Química Analítica"],
    BIOLOGIA: ["Genética", "Ecología", "Microbiología"],
    INFORMATICA: ["Estructura de Datos", "Redes Neuronales", "Desarrollo Web"],
    LENGUA: ["Literatura Contemporánea", "Filología Española", "Escritura Creativa"]
};

// --- FUNCIONES UTILITARIAS ---

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generarNombreCompleto = () => {
    return {
        nombre: random(NOMBRES),
        apellido: random(APELLIDOS)
    }
}

const generarCorreoValido = (nombre, apellido) => {
    const dominios = ["@uni.edu", "@tec.mx", "@escuela.edu.mx"];
    return `${nombre.toLowerCase().replace(/á/g, 'a').replace(/é/g, 'e')}.${apellido.toLowerCase().replace(/ñ/g, 'n').replace(/ú/g, 'u')}${random(dominios)}`;
}

// Genera una fecha aleatoria entre el 1 de enero de 2018 y hoy
const generarFechaAleatoria = () => {
    const start = new Date(2018, 0, 1).getTime();
    const end = new Date().getTime();
    const randomTime = start + Math.random() * (end - start);
    const date = new Date(randomTime);
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
}

// --- FUNCIÓN DE POSTEO SEGURO ---

const safePost = async (url, body, maxIntentos = 3, delayMs = 500) => {
    let intento = 0;

    while (intento < maxIntentos) {
        try {
            const response = await axios.post(url, body, { timeout: 5000 });
            return response;
        } catch (error) {
            intento++;
            
            if (error.response) {
                console.log(`Error ${error.response.status} en ${url}: ${JSON.stringify(error.response.data)}`);
            } else if (error.request) {
                console.log(`Error de Red (Intento ${intento}/${maxIntentos}) -> ${url}`);
            } else {
                console.log(`Error desconocido: ${error.message}`);
            }

            if (intento === maxIntentos) {
                console.log(`Fallo Final después de ${maxIntentos} intentos: ${url}`);
                return null;
            }

            //console.log(`Reintentando en ${delayMs}ms...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
};

// --- GENERACIÓN DE CURSOS ---

const registerCursos = async (id_maestro, area_maestro) => {
    const cursosDisponibles = CURSOS_DICT[area_maestro] || CURSOS_DICT.INFORMATICA;
    const numCursos = Math.floor(Math.random() * 3) + 1; // 1 a 3 cursos

    for (let j = 0; j < numCursos; j++) {
        const nombreCurso = random(cursosDisponibles);
        const grupo = random(["A", "B", "C", "D"]);
        const clave = `${area_maestro.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900) + 100}-${grupo}`;

        const cursoPayload = {
            id_maestro: id_maestro,
            nombre: nombreCurso,
            clave: clave,
            area: area_maestro, // Necesario si tu tabla de Cursos lo requiere
            grupo: grupo,
            horario: random(["07:00-08:30", "08:30-10:00", "10:00-11:30", "16:00-17:30"]),
            salon: random(["101", "205", "310", "404"]),
        };

        const register = await safePost(`${API_BASE}/cursos`, cursoPayload);

        if (register && register.data && register.data.id_curso) {
            CURSOS.push(register.data.id_curso);
            console.log(` └─ Curso registrado: ID ${register.data.id_curso} (${nombreCurso} - ${clave})`);
            
            // Generar Exámenes para este curso
            await registerExamenes(register.data.id_curso);
        } else {
            console.error(` └─ FALLÓ el registro del Curso para maestro ${id_maestro}.`);
        }
    }
};


// --- GENERACIÓN DE EXÁMENES ---

const registerExamenes = async (id_curso) => {
    const tiposExamen = ["Parcial 1", "Parcial 2", "Final"];
    const numExamenes = tiposExamen.length;

    for (let k = 0; k < numExamenes; k++) {
        const examenPayload = {
            id_curso: id_curso,
            tipo: tiposExamen[k],
            fecha: generarFechaAleatoria(),
            nota: (Math.random() * 5 + 5).toFixed(1), // Nota entre 5.0 y 10.0
        };

        const register = await safePost(`${API_BASE}/examenes`, examenPayload);

        if (register && register.data) {
            // console.log(`   └─ Examen (${tiposExamen[k]}) creado para Curso ID ${id_curso}`);
        } else {
            // console.error(`   └─ FALLÓ el registro del Examen para Curso ID ${id_curso}.`);
        }
    }
};


// --- FUNCIÓN PRINCIPAL (MAIN) ---

const main = async () => {
    console.log("========================================");
    console.log(`INICIANDO GENERACIÓN DE ${TOTAL_MAESTROS} MAESTROS`);
    console.log("========================================");
    
    // 1. EJECUTAR PRUEBA DE CONEXIÓN
    // Esta prueba verifica los nombres de campos requeridos
    const pruebaMaestro = {
        nombre: "Prueba", 
        apellido: "Conexion", 
        correo: "prueba.conexion@uni.edu", 
        area: "INFORMATICA", 
        // 🚨 CORREGIDO: De nivelAcademico a nivel_academico
        nivel_academico: "LICENCIATURA", 
        // 🚨 AÑADIDO: Campo obligatorio que faltaba
        fecha_ingreso: generarFechaAleatoria()
    };
    
    console.log("-> Realizando prueba de conexión y validación...");
    const testResponse = await safePost(`${API_BASE}/maestros`, pruebaMaestro);
    
    if (!testResponse || !testResponse.data) {
        console.log("\n========================================");
        console.log(" PRUEBA FALLIDA. VERIFICA:");
        console.log(" 1. Que tu servidor NestJS esté corriendo.");
        console.log(" 2. Que los nombres de campos en 'pruebaMaestro' coincidan con tu DTO:");
        console.log("    (nombre, apellido, correo, area, nivel_academico, fecha_ingreso)");
        console.log(" 3. Que hayas eliminado los campos 'cursos' y 'examenes' del DTO.");
        console.log("========================================");
        return;
    }
    
    console.log(`PRUEBA EXITOSA! Maestro temporal ID ${testResponse.data.id_maestro || '[?]'}\n`);
    
    // 2. INICIAR EL BUCLE DE GENERACIÓN
    for (let i = 1; i <= TOTAL_MAESTROS; i++) {
        const datos = generarNombreCompleto();
        const areaMaestro = random(AREAS);

        const maestroPayload = {
            nombre: datos.nombre, 
            apellido: datos.apellido, 
            correo: generarCorreoValido(datos.nombre, datos.apellido), 
            area: areaMaestro, 
            nivel_academico: random(NIVELES_ACADEMICOS), 
            fecha_ingreso: generarFechaAleatoria() 
        };
        
        console.log(`\n[${i}/${TOTAL_MAESTROS}] Creando Maestro: ${maestroPayload.nombre} ${maestroPayload.apellido}`);
        
        const response = await safePost(`${API_BASE}/maestros`, maestroPayload);
        
        if (response && response.data && response.data.id_maestro) {
            const id_maestro = response.data.id_maestro;
            MAESTROS.push({ id: id_maestro, area: areaMaestro });
            
            // 3. Crear Cursos para el nuevo Maestro
            await registerCursos(id_maestro, areaMaestro);
            
        } else {
            console.error(`[${i}/${TOTAL_MAESTROS}] FALLÓ el registro del Maestro.`);
        }
    }

    // 4. RESUMEN FINAL
    console.log("\n========================================");
    console.log("         ✅ GENERACIÓN COMPLETA ✅      ");
    console.log("========================================");
    console.log(`Docentes Registrados: ${MAESTROS.length}`);
    console.log(`Cursos Registrados: ${CURSOS.length}`);
    console.log("========================================");
};


main();