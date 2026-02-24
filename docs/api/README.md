# **Documentación de la API REST (GameNode)**

Esta carpeta contiene la documentación técnica, los contratos de datos y las herramientas de prueba para consumir el backend de GameNode.

## 🌐 1. Interfaz Interactiva (Swagger UI)

El archivo `openapi.yaml` define toda la estructura de nuestros endpoints (Empresas, Consolas y Videojuegos) utilizando el estándar OpenAPI 3.0.

**¿Cómo explorar la API?**
1. Asegúrate de tener el servidor local ejecutándose (revisa el README principal si tienes dudas).
2. Abre tu navegador y accede a la interfaz gráfica generada automáticamente:
   👉 **[http://localhost:8080/api-docs](http://localhost:8080/api-docs)**

Desde ahí podrás ver los modelos de datos exactos y realizar peticiones de prueba (`Try it out`) directamente contra la base de datos local.

## 🚀 2. Colección de Postman y Tests Automatizados

Para facilitar el desarrollo y cumplir con los estándares de calidad, hemos incluido el archivo `GameNode_Postman_Collection.json`. 

Esta colección contiene todas las operaciones CRUD preconfiguradas e incluye **tests automatizados integrados** en cada endpoint (validación de códigos HTTP 200/201/400/404/500, estructura de respuesta y verificación de datos).

**¿Cómo importarla?**
1. Abre tu cliente de [Postman](https://www.postman.com/).
2. Haz clic en el botón **Import** (esquina superior izquierda).
3. Selecciona o arrastra el archivo `GameNode_Postman_Collection.json` que se encuentra en este directorio.
4. Ya puedes lanzar las peticiones de prueba (recuerda tener el servidor y la base de datos encendidos).

---
*Documentación mantenida por el Equipo GameNode.*