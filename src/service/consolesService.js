// Archivo en el que accedemos a la base de datos a por la informacion requerida y realizamos las operaciones de logica necesarias

const db = require ('../configuration/database.js').db;

/**
 * Metodo para obtener todos las consolas de la base de datos, incluyendo el nombre de la empresa a la que pertenece y los videojuegos disponibles.
 * @returns {Promise <Array>} Devuelve una promesa que resuelve en un array de objetos (consolas).
 */
const findAllConsoles = async () => {
    const consoles = await db('consoles')
        .join('companies', 'consoles.company_id', 'companies.id')
        .select('consoles.*', 'consoles.name', 'companies.name as company_name');

    const consolesWithVideogames = await Promise.all(
        consoles.map(async (console) => {
            const videogames = await db('videogame_console')
                .where('videogame_console.console_id', console.id)
                .join('videogames', 'videogame_console.videogame_id', 'videogames.id')
                .select('videogames.id', 'videogames.title', 'videogames.description', 'videogames.genre', 'videogames.pegi_rating', 'videogames.price', 'videogames.url');

            return {
                ...console,
                videogames: videogames
            };
        })
    );

    return consolesWithVideogames;
};  

/**
 * Metodo para obtener un videojuego por su id, incluyendo el nombre y foto de la consola a la que pertenece.
 * @param {number} id 
 * @returns {Promise<Object|null>} Devuelve una promesa que resuelve en un objeto (consola) o null si no se encuentra la consola.
 */
const findConsoleById = async (id) => {
    const console = await db('consoles')
        .where('consoles.id', id)
        .join('companies', 'consoles.company_id', 'companies.id')
        .select('consoles.*', 'consoles.name', 'companies.name as company_name')
        .first();

    if (!console) return null;

    const videogames = await db('videogame_console')
        .where('videogame_console.console_id', id)
        .join('videogames', 'videogame_console.videogame_id', 'videogames.id')
        .select('videogames.id', 'videogames.title', 'videogames.description', 'videogames.genre', 'videogames.pegi_rating', 'videogames.price', 'videogames.url');

    console.videogames = videogames;

    return console;
};

module.exports = {
    findAllConsoles,
    findConsoleById
}

