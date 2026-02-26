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

    test('should return a list of consoles', async () => {
        const response = await request(app).get('/consoles');

        expect(response.status).toEqual(200);
        expect(response.body.title).toBe('success')
        expect(response.body.message).toBe('Consoles retrieved successfully');
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);

        expect(response.body.data[0].name).toBe('PlayStation 5');
        expect(response.body.data[0]).toHaveProperty('retro');

    });

});