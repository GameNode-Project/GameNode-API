/**
 * Calcula si una consola es retro o no en funcion de si tiene mas de 20 años de antiguedad.
 * @param {Date} releaseDate - Fecha de lanzamiento de la consola.
 * @param {Date} referenceDate - Fecha de referencia para calcular la antiguedad.
 * @returns {boolean} - Devuelve true si la consola es retro (tiene más de 20 años), false en caso contrario.
 */

function isRetro(releaseDate, referenceDate = new Date()) {

    let age = referenceDate.getFullYear() - releaseDate.getFullYear()
    const monthDiff = referenceDate.getMonth() - releaseDate.getMonth()
    const dayDiff = referenceDate.getDate() - releaseDate.getDate()

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--
    }

    return age >= 20
}

module.exports = {
    isRetro
}
