const request = require('supertest');
const app = require('../../app');
const { db } = require('../../configuration/database');

describe('Integration test for consoles API', () => {
  beforeAll(async () => {
    await db.raw('SET FOREIGN_KEY_CHECKS = 0;');

    await db('videogame_console').truncate();
    await db('videogames').truncate();
    await db('consoles').truncate();
    await db('companies').truncate();

    await db.raw('SET FOREIGN_KEY_CHECKS = 1;');

    await db('companies').insert({
      id: 1,
      name: 'Rockstar Games',
      description: 'Pioneros del genero sandbox moderno',
      country: 'EEUU',
      year_founded: 1998,
      website: 'https://www.rockstargames.com/',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Rockstar_Games_Logo.svg/1920px-Rockstar_Games_Logo.svg.png'
    });

    await db('consoles').insert({
      id: 1,
      name: 'PlayStation 5',
      description: 'Potencia bruta con carga ultrarrapida SSD.',
      release_date: '2020-11-12',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/PlayStation_5_and_DualSense_with_transparent_background.png/1200px-PlayStation_5_and_DualSense_with_transparent_background.png',
      company_id: 1
    });

    await db('videogames').insert({
      id: 1,
      title: 'Grand Theft Auto V',
      description: 'Tres criminales arriesgan todo en Los Santos.',
      genre: 'Action',
      release_date: '2013-09-17',
      pegi_rating: 'PEGI 18',
      price: 29.99,
      url: 'https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_V.png'
    });

    await db('videogame_console').insert({
      videogame_id: 1,
      console_id: 1
    });
  });

  afterAll(async () => {
    await db.destroy();
  });

  // GET /consoles

  describe('GET /consoles', () => {
    test('should return a list of consoles', async () => {
      const response = await request(app).get('/consoles');

      expect(response.status).toEqual(200);
      expect(response.body.title).toBe('success');
      expect(response.body.message).toBe('Consoles retrieved successfully');
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);

      expect(response.body.data[0].name).toBe('PlayStation 5');
      expect(response.body.data[0]).toHaveProperty('retro');
    });
  });

  // GET /consoles/:id

  describe('GET /consoles/:id', () => {
    test('should return a specific console by ID', async () => {
      const response = await request(app).get('/consoles/1');

      expect(response.status).toEqual(200);
      expect(response.body.title).toBe('success');
      expect(response.body.message).toBe('Console retrieved successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.name).toBe('PlayStation 5');
      expect(response.body.data).toHaveProperty('retro');
    });

    test('should return 404 if console not found', async () => {
      const response = await request(app).get('/consoles/999');

      expect(response.status).toEqual(404);
      expect(response.body.title).toBe('not found');
      expect(response.body.message).toBe('Console with id 999 not found');
    });

    test('should return 400 for invalid ID', async () => {
      const response = await request(app).get('/consoles/invalid');

      expect(response.status).toEqual(400);
      expect(response.body.title).toBe('validation error');
      expect(Array.isArray(response.body.errors)).toBe(true);
    });
  });

  // POST /consoles

  describe('POST /consoles', () => {
    test('should create a new console', async () => {
      const newConsole = {
        name: 'Nintendo Switch',
        description: 'La consola híbrida de Nintendo.',
        release_date: '2017-03-03',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Nintendo_Switch_Console.png/1200px-Nintendo_Switch_Console.png',
        company_id: 1,
        videogames: [1]
      };

      const response = await request(app).post('/consoles').send(newConsole);

      expect(response.status).toEqual(201);
      expect(response.body.title).toBe('created');
      expect(response.body.message).toBe('Console created successfully');
      expect(response.body.data.name).toBe('Nintendo Switch');

      const createId = response.body.data.id;

      const dbConsole = await db('consoles').where({ id: createId }).first();
      expect(dbConsole).toBeDefined();
      expect(dbConsole.name).toBe('Nintendo Switch');

      const dbRelation = await db('videogame_console').where({ console_id: createId }).first();
      expect(dbRelation.console_id).toBe(createId);
      expect(dbRelation.videogame_id).toBe(1);
    });

    test('should return 400 for missing required fields', async () => {
      const invalidConsole = {
        description: 'Falta el nombre',
        release_date: '2022-01-01',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Nintendo_Switch_Console.png/1200px-Nintendo_Switch_Console.png',
        company_id: 1
      };

      const response = await request(app).post('/consoles').send(invalidConsole);

      expect(response.status).toEqual(400);
      expect(response.body.title).toBe('validation error');
      expect(Array.isArray(response.body.errors)).toBe(true);
    });
  });

  // PUT /consoles/:id
  describe('PUT /consoles/:id', () => {
    test('should update an existing console', async () => {
      const updatedData = {
        name: 'PlayStation 5 Updated',
        description: 'Descripción actualizada',
        release_date: '2020-11-12',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/PlayStation_5_and_DualSense_with_transparent_background.png/1200px-PlayStation_5_and_DualSense_with_transparent_background.png',
        company_id: 1
      };

      const response = await request(app).put('/consoles/1').send(updatedData);

      expect(response.statusCode).toEqual(200);
      expect(response.body.title).toBe('success');
      expect(response.body.message).toBe('Console updated successfully');
      expect(response.body.data.name).toBe('PlayStation 5 Updated');

      const dbConsole = await db('consoles').where({ id: 1 }).first();

      expect(dbConsole).toBeDefined();
      expect(dbConsole.name).toBe('PlayStation 5 Updated');
    });

    test('should return 404 if console to update is not found', async () => {
      const updatedData = {
        name: 'Nonexistent Console',
        description: 'Esta consola no existe',
        release_date: '2022-01-01',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/PlayStation_5_and_DualSense_with_transparent_background.png/1200px-PlayStation_5_and_DualSense_with_transparent_background.png',
        company_id: 1
      };

      const response = await request(app).put('/consoles/999').send(updatedData);

      expect(response.statusCode).toEqual(404);
      expect(response.body.title).toBe('not-found');
      expect(response.body.message).toBe('Console with id 999 not found after update');
    });

    test('should return 400 for invalid input data', async () => {
      const invalidData = {
        name: '',
        description: 'Nombre no puede estar vacío',
        release_date: '2022-01-01',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/PlayStation_5_and_DualSense_with_transparent_background.png/1200px-PlayStation_5_and_DualSense_with_transparent_background.png'
      };

      const response = await request(app).put('/consoles/1').send(invalidData);

      expect(response.statusCode).toEqual(400);
      expect(response.body.title).toBe('validation error');
      expect(Array.isArray(response.body.errors)).toBe(true);
    });
  });
});
