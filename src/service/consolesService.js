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

/**
 * Añade una nueva consola a la base de datos, y si se proporcionan videojuegos, también añade las relaciones 
 * correspondientes en la tabla intermedia.
 * @param {Object} consoleData - Objeto con los datos de la consola a añadir.
 * @returns {Promise<number>} Devuelve una promesa que resuelve en el ID de la nueva consola creada.
 */

const addConsole = async (consoleData) => {
    const { name, company_id, release_year, price, url } = consoleData;
    const [newId] = await db('consoles').insert({
        name,
        company_id,
        release_year,
        price,
        url
    });
    
    if (consoles && consoles.length > 0) {
        const relations = consoles.map((videogameId) => ({
            console_id: newId,
            videogame_id: videogameId
        }));
        await db('videogame_console').insert(relations);
    }
    
    return newId;
}

module.exports = {
    findAllConsoles,
    findConsoleById,
    addConsole
}

