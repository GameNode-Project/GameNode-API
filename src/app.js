const express = require("express");
const { config, swaggerDocument } = require("./configuration/config");
const swaggerUi = require("swagger-ui-express");

const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Zona de rutas.
const companiesRouter = require("./router/companiesRouter");
const videogamesRouter = require("./router/videogamesRouter");
const consolesRouter = require("./router/consolesRouter");

// Asignamos las URLs base.
app.use("/companies", companiesRouter);
app.use("/videogames", videogamesRouter);
app.use("/consoles", consolesRouter);

// Ruta para manejar endpoints no encontrados.
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    title: "not-found",
    message: "Endpoint no encontrado",
  });
});

// Manejador de errores global, para capturar errores no controlados.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.status(500).json({
    code: 500,
    title: "internal-error",
    message: "Error interno del servidor",
  });
});

const PORT = process.env.PORT || config.service?.port || 8080;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend iniciado en el puerto: ${PORT}`);
  });
}

module.exports = app;