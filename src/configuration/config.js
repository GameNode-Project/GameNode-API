const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

let config;
let swaggerDocument;

try {
    let configFile = 'config.local.yaml';
    const argv = yargs(hideBin(process.argv)).argv;
    if (argv.config !== undefined) {
        configFile = argv.config;
    }
    const absoluteConfigPath = path.resolve(process.cwd(), configFile);
    config = yaml.load(fs.readFileSync(absoluteConfigPath, 'utf-8'));

    const swaggerPath = path.join(__dirname, '../../docs/api/openapi.yaml');
    swaggerDocument = yaml.load(fs.readFileSync(swaggerPath, 'utf8'));

    if (!swaggerDocument) {
        throw new Error("El archivo openapi.yaml está vacío o no se ha guardado correctamente.");
    }

} catch (error) {
    /* eslint-disable no-console */
    console.error('\n❌ ERROR CRÍTICO AL ARRANCAR EL SERVIDOR ❌');
    console.error('No se pudo leer o procesar un archivo de configuración YAML.');
    console.error(`Detalle del error: ${error.message}\n`);
    /* eslint-enable no-console */
    process.exit(1); 
}

module.exports = {
    config,
    swaggerDocument
};