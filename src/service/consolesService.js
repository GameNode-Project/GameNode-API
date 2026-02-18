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

    const VideogameRelations = await db('videogame_console')
        .join('videogames', 'videogame_console.videogame_id', 'videogames.id')
        .select('videogame_console.console_id', 'videogames.id as videogame_id', 'videogames.title as videogame_title');

    const consolesWithVideogames = consoles.map((console) => {
        const consolesVideogames = VideogameRelations
            .filter((relation) => relation.console_id === console.id)
            .map(v => ({
                id: v.videogame_id,
                title: v.videogame_title
            }));
        return {
            ...console,
            videogames: consolesVideogames
        }
    });

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
    const { name, description, release_date, url, company_id, videogames } = consoleData;
    const [newId] = await db('consoles').insert({
        name,
        description,
        release_date,
        url,
        company_id
    });

    if (videogames && videogames.length > 0) {
        const relations = videogames.map((videogameId) => ({
            console_id: newId,
            videogame_id: videogameId
        }));
        await db('videogame_console').insert(relations);
    }

    return newId;
}

/**
 * Actualiza la informacion de la consola existente.
 * Actualiza los datos basicos y si se proporcionan videojuegos, actualiza las relaciones correspondientes en la tabla intermedia.
 * @param {number} id - El id de la consola a actualizar. 
 * @param {*} consoleData - Objeto con los datos de la consola a actualizar.
 * @return {Promise<void>} Devuelve una promesa que se resuelve cuando la consola ha sido actualizada correctamente.
 */

const updateConsole = async (id, consoleData) => {
    const { name, description, release_date, url, company_id, videogames } = consoleData;
    await db('consoles')
        .where({ id })
        .update({
            name,
            description,
            release_date,
            url,
            company_id
        });

    if (videogames !== undefined) {
        await db('videogame_console').where({ console_id: id }).del();

        if (videogames && videogames.length > 0) {
            const relations = videogames.map((videogameId) => ({
                console_id: id,
                videogame_id: videogameId
            }));
            await db('videogame_console').insert(relations);
        }
    }
};

/**
 * Elimina una consola de la base de datos.
 * @param {*} id - El id de la consola a eliminar
 * @returns {Promise<number>} Devuelve una promesa que resuelve en el número de filas eliminadas.
 */

const removeConsole = async (id) => {
    return await db('consoles').where({ id }).del();
}

module.exports = {
    findAllConsoles,
    findConsoleById,
    addConsole,
    updateConsole,
    removeConsole
}

