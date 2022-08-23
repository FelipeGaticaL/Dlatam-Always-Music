
//Crear base de datos en PgAdmin alwaymusic
//Crear tabla en PgAdmin

/* CREATE TABLE estudiantes (
	rut VARCHAR(12) PRIMARY KEY,
	nombre VARCHAR(50),
	curso VARCHAR(50),
	nivel INT
)
 */


const { Pool } = require("pg");

const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'alwaymusic',
    password: '1234',
    port: 5432,
};

const pool = new Pool(config);

/* Sección argumentos por consola */
console.log(process.argv);
const argumentos = process.argv.slice(2);
const funcion = argumentos[0];
const rut = argumentos[1];
const nombre = argumentos [2];
const curso = argumentos [3];
const nivel = argumentos [4];

console.log({rut,nombre,curso,nivel});



/*2.- Crear una función asíncrona para registrar un nuevo estudiante en la base de datos.
(2 punto) */

const postEstudiantes = async({rut,nombre,curso,nivel})=>{
    const res = await pool.query(
        `INSERT INTO estudiantes (rut, nombre, curso, nivel) VALUES ('${rut}','${nombre}','${curso}','${nivel}') RETURNING *;`
    )
    console.log("Ultimo registro agregado: ", res.rows[0]);
    console.log("Registros afectados", res.rowCount);
};

//postEstudiantes({rut: '11.111.111-1', nombre: 'Pedro', curso: 'Lenguaje', nivel: 5})


/* 2. Crear una función asíncrona para obtener por consola el registro de un estudiante
por medio de su rut. (2 punto) */


const consultaRut = async ({rut}) => {
    const res = await pool.query(`select * from estudiantes where rut = '${rut}'`);
    console.log(`Registro con el rut: ${rut}`, res.rows[0]);
    };
    
//consultaRut({rut: "11.111.111-1"});

/* 3. Crear una función asíncrona para obtener por consola todos los estudiantes
registrados. (2 punto) */

const getEstudiantes = async ()=>{
    const res = await pool.query(
       `SELECT * FROM estudiantes` 
    )
    console.log(res.rows)
}

//getEstudiantes();


/* 4. Crear una función asíncrona para actualizar los datos de un estudiante en la base de
datos. (2 punto) */


const editarEstudiantes = async ({ rut, nombre, curso, nivel }) => {
    const res = await pool.query(
        `UPDATE estudiantes SET nombre='${nombre}', rut='${rut}', curso='${curso}', nivel='${nivel}' WHERE rut = '${rut}' RETURNING *;`
    );
    console.log('Registro modificado', res.rows[0]);
    console.log('Cantidad de registros afectados', res.rowCount);
    console.log(`Estudiante ${nombre} editado con éxito`);
}

//editarEstudiantes({ rut: '11.111.111-1', nombre: 'Jaime', curso: 'Filosofía',nivel: 1});

/* 5. Crear una función asíncrona para eliminar el registro de un estudiante de la base de
datos. (2 punto) */

const eliminarEstudiante = async ({ rut }) => {
    const result = await pool.query(`DELETE FROM estudiantes WHERE rut = '${rut}'`);
    console.log("Registros afectados:", result.rowCount);
    console.log(`estudiantes con rut = ${rut} eliminado`);
};

eliminarEstudiante({ rut: '11.111.111-1' });

/* Creando función con doble método, para poder ejecutarlo como promesa */

const funciones = {
    get: getEstudiantes,
    post: postEstudiantes,
    actualizar: editarEstudiantes,
    delete: eliminarEstudiante
};

(async ()=>{
    await funciones[funcion]({rut,nombre,curso,nivel})
})();


//Consulta a través de consola: node index get
//agregando nuevos valores a través de consola: node index post "22.222.222-2" "alberto" "inglés" 6
//editando  valores a través de consola: node index actualizar "22.222.222-2" "rafael" "inglés" 6
//eliminando  valores a través de consola: node index delete "22.222.222-2"

