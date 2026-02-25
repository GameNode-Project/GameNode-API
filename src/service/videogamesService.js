// Archivo en el que accedemos a la base de datos a por la información requerida y realizamos las operaciones de lógica necesarias.

const db = require("../configuration/database.js").db;

/**
 * Método para obtener todos los videojuegos de la base de datos, incluyendo el nombre y logo de la compañía a la que pertenecen.
 * @returns {Promise<Array>} Devuelve una Promesa que resuelve en un array de objetos (videojuegos).
 */
const findAllVideogames = async () => {
  const games = await db("videogames")
    .join("companies", "videogames.company_id", "companies.id")
    .select(
      "videogames.*",
      "companies.name as company_name",
      "companies.logo as company_logo",
    );

  const consoleRelations = await db("videogame_console")
    .join("consoles", "videogame_console.console_id", "consoles.id")
    .select("videogame_console.videogame_id", "consoles.id", "consoles.name");

  const gamesWithConsoles = games.map((game) => {
    const gameConsoles = consoleRelations
      .filter((relation) => relation.videogame_id === game.id)
      .map((c) => ({ id: c.id, name: c.name }));
    return {
      ...game,
      consoles: gameConsoles,
    };
  });

  return gamesWithConsoles;
};

/**
 * Método para obtener un videojuego por su id, incluyendo el nombre y logo de la compañía a la que pertenece, y un array con las consolas en las que está disponible.
 * @param {number} id
 * @returns {Promise<Object|null>} Devuelve una Promesa con el objeto del videojuego si existe, o null si no se encuentra.
 */
const findVideogameById = async (id) => {
  const videogame = await db("videogames")
    .where("videogames.id", id)
    .join("companies", "videogames.company_id", "companies.id")
    .select(
      "videogames.*",
      "companies.name as company_name",
      "companies.logo as company_logo",
    )
    .first();

  if (!videogame) return null;

  const consoles = await db("videogame_console")
    .where("videogame_console.videogame_id", id)
    .join("consoles", "videogame_console.console_id", "consoles.id")
    .select(
      "consoles.id",
      "consoles.name as console_name",
      "consoles.url as console_url",
    );

  videogame.consoles = consoles;

  return videogame;
};

/**
 * Añade un nuevo videojuego a la base de datos, y si se proporcionan consolas,
 * también añade las relaciones correspondientes en la tabla 'videogame_console'.
 * @param {Object} videogameData - Objeto que contiene datos del juego Y el array 'consoles'.
 * @returns {Promise<number>} Devuelve el ID del nuevo videojuego insertado.
 */
const addVideogame = async (videogameData) => {
  const { consoles, ...videogameInfo } = videogameData;

  const [newId] = await db("videogames").insert(videogameInfo);

  if (consoles && consoles.length > 0) {
    const relations = consoles.map((consoleId) => ({
      videogame_id: newId,
      console_id: consoleId,
    }));
    await db("videogame_console").insert(relations);
  }

  return newId;
};

/**
 * Actualiza la información de un videojuego existente.
 * Actualiza los datos básicos y, si se proporciona una lista de consolas,
 * reemplaza las relaciones existentes por las nuevas.
 * @param {number} id - El ID del videojuego a actualizar.
 * @param {Object} videogameData - Objeto con los datos a actualizar (puede incluir 'consoles').
 * @returns {Promise<void>} No devuelve ningún valor. Ejecuta la operación en la base de datos.
 */
const updateVideogame = async (id, videogameData) => {
  const { consoles, ...videogameInfo } = videogameData;

  const updatedRows = await db("videogames").where({ id }).update(videogameInfo);

  if (updatedRows === 0) {
    return 0; 
  }

  if (consoles !== undefined) {
    await db("videogame_console").where({ videogame_id: id }).del();

    if (consoles.length > 0) {
      const relations = consoles.map((consoleId) => ({
        videogame_id: id,
        console_id: consoleId,
      }));
      await db("videogame_console").insert(relations);
    }
  }
};

/**
 * Elimina un videojuego por su ID.
 * @param {number} id - El ID del videojuego a eliminar.
 * @returns {Promise<number>} Devuelve 1 si se borró el registro, 0 si no existía.
 */
const removeVideogame = async (id) => {
  return await db("videogames").where({ id }).del();
};

module.exports = {
  findAllVideogames,
  findVideogameById,
  addVideogame,
  updateVideogame,
  removeVideogame,
};
