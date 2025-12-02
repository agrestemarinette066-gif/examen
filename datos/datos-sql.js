const fs = require("fs");

const TOTAL_MAESTROS = 100;
const CURSOS_POR_MAESTRO = 2;
const examen_POR_CURSO = 3;
const YEAR = 2025;

const AREAS = ["MATEMATICAS", "FISICA", "QUIMICA", "BIOLOGIA", "INFORMATICA", "LENGUA"];
const NIVELES_ACADEMICOS = ["LICENCIATURA", "MAESTRIA", "DOCTORADO"];
const TIPOS_EXAMEN = ["Parcial", "Final", "Extraordinario"];

const NOMBRES = [
  "Juan", "Carlos", "Luis", "Miguel", "Jose", "Jorge", "Felipe", "Hector",
  "Marco", "Ricardo", "Fernando", "Pablo", "Rafael", "Alberto", "Andres",
  "Roberto", "Eduardo", "Cristian", "Mario", "Diego", "Omar", "Sergio",
  "Francisco", "Adrian", "Hernan", "Erick", "Kevin", "Oscar", "Manuel",
  "Víctor", "Alan", "Emilio", "Ramiro", "Leonardo", "Esteban", "Bruno",
  "Mauricio", "Gustavo", "Elías", "Tomás",
  "Maria", "Ana", "Laura", "Patricia", "Carmen", "Isabel", "Sofia", "Lucia",
  "Elena", "Claudia", "Monica", "Veronica", "Gabriela", "Adriana", "Silvia",
  "Teresa", "Rosa", "Diana", "Jessica", "Natalia", "Valeria", "Camila",
  "Fernanda", "Andrea", "Daniela", "Paola", "Carolina", "Beatriz"
];

const APELLIDOS = [
  "Hernandez", "Martinez", "Gomez", "Perez", "Lopez", "Garcia",
  "Rodriguez", "Sanchez", "Ramirez", "Cruz", "Torres", "Rivera",
  "Gonzalez", "Flores", "Vargas", "Castillo", "Ortega", "Ruiz",
  "Aguilar", "Chavez", "Dominguez", "Silva", "Navarro", "Salazar",
  "Mendoza", "Ponce", "Morales", "Soto", "Camacho", "Cortés",
  "Arias", "Palacios", "Estrada", "Valdez", "Montoya", "Ramos"
];


const MATERIAS_POR_AREA = {
  "MATEMATICAS": [
    "Álgebra Lineal", "Cálculo Diferencial", "Cálculo Integral", 
    "Geometría Analítica", "Estadística", "Matemáticas Discretas",
    "Ecuaciones Diferenciales"
  ],
  "FISICA": [
    "Física I", "Física II", "Mecánica Clásica", "Termodinámica",
    "Electromagnetismo", "Óptica", "Física Moderna"
  ],
  "QUIMICA": [
    "Química General", "Química Orgánica", "Química Inorgánica",
    "Bioquímica", "Química Analítica", "Fisicoquímica"
  ],
  "BIOLOGIA": [
    "Biología Celular", "Genética", "Ecología", "Microbiología",
    "Zoología", "Botánica", "Fisiología"
  ],
  "INFORMATICA": [
    "Programación I", "Programación II", "Bases de Datos",
    "Estructuras de Datos", "Redes de Computadoras", "Sistemas Operativos"
  ],
  "LENGUA": [
    "Literatura Española", "Lengua y Redacción", "Gramática",
    "Fonética y Fonología", "Lingüística", "Análisis Literario"
  ]
};

const GRUPOS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const HORARIOS = [
  "07:00-08:30", "08:30-10:00", "10:00-11:30", 
  "11:30-13:00", "13:00-14:30", "14:30-16:00", "16:00-17:30"
];
const SALONES = [
  "101", "102", "103", "104", "105", "106", "107", "108",
  "201", "202", "203", "204", "205", "206", "207", "208",
  "301", "302", "303", "304", "305", "306", "307", "308"
];

const random = arr => arr[Math.floor(Math.random() * arr.length)];

const generarNombreCompleto = () => ({
    nombre: random(NOMBRES),
    apellido: random(APELLIDOS) 
});

const generarCorreo = (nombre, apellido) => {
  const dominios = ["@gmail.com", "@hotmail.com", "@outlook.com", "@escuela.edu.mx", "@universidad.edu.mx"];
  return `${nombre.toLowerCase()}.${apellido.toLowerCase()}${random(dominios)}`;
};

const generarFechas2025 = () => {
  const fechas = [];
  const inicio = new Date(`${YEAR}-01-01T00:00:00Z`);
  
  for (let d = 0; d < 365; d++) {
    const cur = new Date(inicio);
    cur.setUTCDate(cur.getUTCDate() + d);
    const dia = cur.getUTCDay();
    if (dia >= 1 && dia <= 5) {
      fechas.push(cur.toISOString().slice(0, 10));
    }
  }
  return fechas;
};

const FECHAS_2025 = generarFechas2025();


const generarClaveCurso = () => {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numeros = "0123456789";
  let clave = "";
  for (let i = 0; i < 3; i++) clave += random(letras.split(''));
  clave += "-";
  for (let i = 0; i < 3; i++) clave += random(numeros.split(''));
  return clave;
};


const generarFechaExamen = () => {
  const mes = Math.floor(Math.random() * 12) + 1;
  const dia = Math.floor(Math.random() * 28) + 1;
  return `${YEAR}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
};

const maestrosSQL = fs.createWriteStream("maestros.sql");
const cursosSQL = fs.createWriteStream("cursos.sql");
const examenSQL = fs.createWriteStream("examen.sql");


maestrosSQL.write(
  `INSERT INTO "Maestro" (nombre, apellido, correo, area, nivel_academico, fecha_ingreso) VALUES\n`
);

cursosSQL.write(
  `INSERT INTO "Curso" (id_maestro, nombre, clave, grupo, horario, salon) VALUES\n`
);

examenSQL.write(
  `INSERT INTO "Examen" (id_curso, tipo, fecha, promedio, comentarios) VALUES\n`
);

const maestrosIDs = [];
const cursosData = []; 

(async () => {
    console.log("Generando datos para Maestros...");
    
    
    for (let i = 1; i <= TOTAL_MAESTROS; i++) {
        const nombreCompleto = generarNombreCompleto();
        const area = random(AREAS);
        const nivel = random(NIVELES_ACADEMICOS);
        const correo = generarCorreo(nombreCompleto.nombre, nombreCompleto.apellido);
        
       
        const añoIngreso = 2015 + Math.floor(Math.random() * 10);
        const mesIngreso = Math.floor(Math.random() * 12) + 1;
        const diaIngreso = Math.floor(Math.random() * 28) + 1;
        const fechaIngreso = `${añoIngreso}-${mesIngreso.toString().padStart(2, '0')}-${diaIngreso.toString().padStart(2, '0')}`;
        
        maestrosIDs.push(i);
        
        maestrosSQL.write(
          `('${nombreCompleto.nombre}','${nombreCompleto.apellido}','${correo}','${area}','${nivel}','${fechaIngreso}')` +
          (i < TOTAL_MAESTROS ? ",\n" : ";\n")
        );
        
        // Progreso
        if (i % 20 === 0) {
            console.log(`  ${i}/${TOTAL_MAESTROS} maestros generados...`);
        }
    }
    
    console.log("Generando datos para Cursos...");
    
    
    let cursoCounter = 0;
    let firstCurso = true;
    
    for (const idMaestro of maestrosIDs) {
        const areaMaestro = AREAS[(idMaestro - 1) % AREAS.length];
        
        for (let j = 0; j < CURSOS_POR_MAESTRO; j++) {
            cursoCounter++;
            const materiasDisponibles = MATERIAS_POR_AREA[areaMaestro];
            const materia = random(materiasDisponibles);
            const clave = generarClaveCurso();
            const grupo = random(GRUPOS);
            const horario = random(HORARIOS);
            const salon = random(SALONES);
            
            cursosData.push({
                id_curso: cursoCounter,
                id_maestro: idMaestro,
                area: areaMaestro
            });
            
            if (!firstCurso) cursosSQL.write(",\n");
            firstCurso = false;
            
            cursosSQL.write(
              `(${idMaestro},'${materia}','${clave}','${grupo}','${horario}','${salon}')`
            );
        }
        
        // Progreso
        if (idMaestro % 20 === 0) {
            console.log(`  ${idMaestro}/${TOTAL_MAESTROS} maestros procesados...`);
        }
    }
    
    cursosSQL.write(";\n");
    
    console.log("Generando datos para Exámenes...");
    
    // 3. GENERAR EXÁMENES
    let examenCounter = 0;
    let firstExamen = true;
    
    for (const curso of cursosData) {
        for (let k = 0; k < examen_POR_CURSO; k++) {
            examenCounter++;
            const tipo = TIPOS_EXAMEN[k] || random(TIPOS_EXAMEN);
            const fecha = generarFechaExamen();
            const promedio = (6 + (Math.random() * 4)).toFixed(2); // Entre 6.00 y 10.00
            
            // Comentario según el tipo de examen
            let comentario = "";
            switch(tipo) {
                case "Parcial":
                    comentario = `Examen parcial del curso ${curso.id_curso}`;
                    break;
                case "Final":
                    comentario = `Examen final del curso ${curso.id_curso}`;
                    break;
                case "Extraordinario":
                    comentario = `Examen extraordinario del curso ${curso.id_curso}`;
                    break;
                default:
                    comentario = `Examen aplicado el ${fecha}`;
            }
            
            if (!firstExamen) examenSQL.write(",\n");
            firstExamen = false;
            
            examenSQL.write(
              `(${curso.id_curso},'${tipo}','${fecha}',${promedio},'${comentario}')`
            );
        }
        
        // Progreso
        if (curso.id_curso % 50 === 0) {
            console.log(`  ${curso.id_curso}/${cursosData.length} cursos procesados...`);
        }
    }
    
    examenSQL.write(";\n");
    
    // Cerrar archivos
    maestrosSQL.end();
    cursosSQL.end();
    examenSQL.end();
    
    console.log("\nARCHIVOS SQL GENERADOS CORRECTAMENTE");
    console.log("==========================================");
    console.log(` RESUMEN DE DATOS:`);
    console.log(`   • Maestros: ${TOTAL_MAESTROS}`);
    console.log(`   • Cursos: ${cursosData.length} (${CURSOS_POR_MAESTRO} por maestro)`);
    console.log(`   • Exámenes: ${examenCounter} (${examen_POR_CURSO} por curso)`);
    console.log("\nArchivos creados:");
    console.log("   1. maestros.sql");
    console.log("   2. cursos.sql");
    console.log("   3. examen.sql");
    console.log("\n Para ejecutar en PostgreSQL:");
    console.log("   psql -U tu_usuario -d maestro -f maestros.sql");
    console.log("   psql -U tu_usuario -d maestro -f cursos.sql");
    console.log("   psql -U tu_usuario -d maestro -f examen.sql");
    console.log("\nCONSULTAS SQL DE EJEMPLO:");
    console.log("   1. Listar maestros por área:");
    console.log("      SELECT * FROM \"Maestro\" WHERE area = 'MATEMATICAS';");
    console.log("\n   2. Ver cursos de un maestro:");
    console.log("      SELECT * FROM \"Curso\" WHERE id_maestro = 1;");
    console.log("\n   3. Exámenes por tipo:");
    console.log("      SELECT * FROM \"Examen\" WHERE tipo = 'Parcial';");
    console.log("\n   4. Contar exámenes por curso:");
    console.log("      SELECT id_curso, COUNT(*) FROM \"Examen\" GROUP BY id_curso;");
    
})();