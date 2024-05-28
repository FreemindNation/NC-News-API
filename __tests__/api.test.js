const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const db = require('../db/connection');
const request = require('supertest');
const app = require('../api/app');


beforeEach(() => seed(testData));

afterAll (()=> db.end());

describe('/api/topics', () => {
    test('200: responds with all available topics', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body })=> {
            const topics = body.rows;
            expect(topics).toHaveLength(3)
            topics.forEach((topic)=> {
                expect(topic).toMatchObject({
                    description: expect.any(String),
                    slug: expect.any(String)
                });
            });
        });

    });

    test('404: responds with "Route not found" if passed an invalid route', () => {
        return request(app)
        .get('/api/not-a-valid-route')
        .expect(404)
        .then(({ body })=> {
            expect(body.msg).toBe('Route not found');
        })
    });
});