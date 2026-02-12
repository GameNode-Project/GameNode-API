// Archivo en el que accedemos a la base de datos a por la información requerida y realizamos las operaciones de lógica necesarias.

const db = require('../configuration/database.js').db;

/**
 * Método para obtener todos los videojuegos de la base de datos, incluyendo el nombre y logo de la compañía a la que pertenecen.
 * @returns {Promise<Array>} Devuelve una Promesa que resuelve en un array de objetos (videojuegos).
 */
const findAllVideogames = async () => {
    return await db('videogames')
      .join('companies', 'videogames.company_id', 'companies.id')
      .select('videogames.*', 'companies.name as company_name', 'companies.logo as company_logo');
};

/**
 * Método para obtener un videojuego por su id, incluyendo el nombre y logo de la compañía a la que pertenece, y un array con las consolas en las que está disponible.
 * @param {number} id 
 * @returns {Promise<Object|null>} Devuelve una Promesa con el objeto del videojuego si existe, o null si no se encuentra.
 */
const findVideogameById = async (id) => {
  const videogame = await db('videogames')
    .where('videogames.id', id)
    .join('companies', 'videogames.company_id', 'companies.id')
    .select('videogames.*', 'companies.name as company_name', 'companies.logo as company_logo')
    .first();
  
    if (!videogame) return null;

  const consoles = await db('videogame_console')
    .where('videogame_console.videogame_id', id)
    .join('consoles', 'videogame_console.console_id', 'consoles.id')
    .select('consoles.id', 'consoles.name as console_name', 'consoles.url as console_url');

  videogame.consoles = consoles;

  return videogame;
};

module.exports = {
  findAllVideogames,
  findVideogameById
}