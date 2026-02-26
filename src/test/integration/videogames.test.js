const request = require('supertest');
const app = require('../../app');
const { db } = require('../../configuration/database');

describe('Integration tests for videogames API', () => {

  beforeAll(async () => {
    
    await db.raw('SET FOREIGN_KEY_CHECKS = 0');
    
    await db('videogame_console').truncate();
    await db('videogames').truncate();
    await db('companies').truncate();
    await db('consoles').truncate();
    
    await db.raw('SET FOREIGN_KEY_CHECKS = 1');

    await db('companies').insert({ 
      id: 1, 
      name: 'Nintendo', 
      description: 'Gigante japonés del entretenimiento familiar.',
      country: 'Japón',
      year_founded: 1889,
      website: 'https://www.nintendo.com',
      logo: 'logo.png'
    });

    await db('consoles').insert({ 
      id: 1, 
      name: 'Nintendo Switch', 
      description: 'Híbrida: juega en la TV o en modo portátil.',
      release_date: '2017-03-03',
      url: 'url.png',
      company_id: 1
    });

    await db('videogames').insert({ 
      id: 1, 
      title: 'Zelda: Breath of the Wild', 
      description: 'Explora Hyrule con libertad total.',
      genre: 'Adventure',
      release_date: '2017-03-03',
      pegi_rating: 'PEGI 12',
      price: 59.99, 
      url: 'url.jpg',
      company_id: 1 
    });

    await db('videogame_console').insert({
      videogame_id: 1,
      console_id: 1
    });

  });

  afterAll(async () => {
    await db.destroy();
  });

  // GET /videogames
  describe('GET /videogames', () => {

    test('should return a list of videogames', async () => {
      
      const response = await request(app).get('/videogames');
      
      expect(response.statusCode).toEqual(200);
      expect(response.body.title).toBe('success');
      expect(response.body.message).toBe('Videogames retrieved successfully');
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);

      expect(response.body.data[0].title).toBe('Zelda: Breath of the Wild');
      expect(response.body.data[0]).toHaveProperty('priceWithTax');
    
    });

  });

  // GET /videogames/:id
  describe('GET /videogames/:id', () => {

    test('should return a single videogame by ID', async () => {
      
      const response = await request(app).get('/videogames/1');
      
      expect(response.statusCode).toEqual(200);
      expect(response.body.title).toBe('success');
      expect(response.body.message).toBe('Videogame retrieved successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.title).toBe('Zelda: Breath of the Wild');
      expect(response.body.data).toHaveProperty('priceWithTax');
    
    });

    test('should return 404 if videogame not found', async () => {
      
      const response = await request(app).get('/videogames/999');
      
      expect(response.statusCode).toEqual(404);
      expect(response.body.title).toBe('not-found');
      expect(response.body.message).toBe('Videogame with id 999 not found');
    
    });

    test('should return 400 for invalid ID', async () => {
      
      const response = await request(app).get('/videogames/invalid');
      
      expect(response.statusCode).toEqual(400);
      expect(response.body.title).toBe('validation error');
      expect(Array.isArray(response.body.errors)).toBe(true);
    
    });

  });

  // POST /videogames
  describe('POST /videogames', () => {

    test('should create a new videogame', async () => {

      const newGame = {
        title: 'Super Mario Odyssey',
        description: 'Mario explora mundos increíbles en esta aventura 3D.',
        genre: 'Platformer',
        release_date: '2017-10-27',
        pegi_rating: 'PEGI 7',
        price: 59.99,
        url: 'url.jpg',
        company_id: 1,
        consoles: [1]
      };

      const response = await request(app).post('/videogames').send(newGame);

      expect(response.statusCode).toEqual(201);
      expect(response.body.title).toBe('created');
      expect(response.body.message).toBe('Videogame created successfully');
      expect(response.body.data.title).toBe('Super Mario Odyssey');

      const createdId = response.body.data.id;

      const dbGame = await db('videogames').where({ id: createdId }).first();
      expect(dbGame).toBeDefined();
      expect(dbGame.title).toBe('Super Mario Odyssey');

      const dbRelation = await db('videogame_console').where({ videogame_id: createdId }).first();
      expect(dbRelation).toBeDefined();
      expect(dbRelation.console_id).toBe(1);

    });

    test('should return 400 for missing required fields', async () => {
      
      const invalidVideogame = {
        title: 'Juego Roto',
        description: 'Faltan casi todos los campos y el precio es negativo',
        price: -10, 
        pegi_rating: 'PEGI 99'
      };

      const response = await request(app).post('/videogames').send(invalidVideogame);
      
      expect(response.statusCode).toEqual(400);
      expect(response.body.title).toBe('validation error');
      expect(Array.isArray(response.body.errors)).toBe(true);
      
    });

  });

  // PUT /videogames/:id
  describe('PUT /videogames/:id', () => {

    test('should update an existing videogame', async () => {
      
      const updatedGame = {
        title: 'Zelda: Tears of the Kingdom', 
        description: 'La esperadísima secuela de la aventura en Hyrule.', 
        genre: 'Adventure',
        release_date: '2023-05-12', 
        pegi_rating: 'PEGI 12',
        price: 69.99, 
        url: 'https://ejemplo.com/zelda.jpg',
        company_id: 1, 
        consoles: [1]  
      };

      const response = await request(app).put('/videogames/1').send(updatedGame);

      expect(response.statusCode).toEqual(200);
      expect(response.body.title).toBe('success');
      expect(response.body.message).toBe('Videogame updated successfully');
      expect(response.body.data.title).toBe('Zelda: Tears of the Kingdom');

      const dbGame = await db('videogames').where({ id: 1 }).first();
      
      expect(dbGame).toBeDefined();
      expect(dbGame.title).toBe('Zelda: Tears of the Kingdom');
      expect(parseFloat(dbGame.price)).toBe(69.99);

    });

    test('should return 404 if trying to update a non-existent videogame', async () => {

      const validPayload = {
        title: 'Juego Fantasma',
        description: 'No existo',
        genre: 'Action',
        release_date: '2024-01-01',
        pegi_rating: 'PEGI 18',
        price: 19.99,
        url: 'fantasma.jpg',
        company_id: 1,
        consoles: [1]
      };

      const response = await request(app).put('/videogames/999').send(validPayload);

      expect(response.statusCode).toEqual(404);
      expect(response.body.title).toBe('not-found');
      expect(response.body.message).toBe('Videogame with id 999 not found after update');

    });

    test('should return 400 for invalid update data', async () => {

      const invalidPayload = {
        title: '', 
        description: 'Datos inválidos',
        genre: 'Action',
        release_date: 'invalid-date',
        pegi_rating: 'PEGI 18',
        price: -5,
        url: 'invalid.jpg',
        company_id: 1,
        consoles: [1]
      };

      const response = await request(app).put('/videogames/1').send(invalidPayload);

      expect(response.statusCode).toEqual(400);
      expect(response.body.title).toBe('validation error');
      expect(Array.isArray(response.body.errors)).toBe(true);

    });
  
  });

  // DELETE /videogames/:id
  describe('DELETE /videogames/:id', () => {

    test('should delete a videogame and return 200', async () => {

      const response = await request(app).delete('/videogames/1');

      expect(response.statusCode).toEqual(200);
      expect(response.body.title).toBe('success');
      expect(response.body.message).toBe('Videogame with id 1 deleted successfully');

      const dbGame = await db('videogames').where({ id: 1 }).first();
      expect(dbGame).toBeUndefined(); 

      const dbRelation = await db('videogame_console').where({ videogame_id: 1 }).first();
      expect(dbRelation).toBeUndefined(); 
    
    });

    test('should return 404 if videogame is already deleted or not found', async () => {

      const response = await request(app).delete('/videogames/1');

      expect(response.statusCode).toEqual(404);
      expect(response.body.title).toBe('not-found');
    
    });

  });

});