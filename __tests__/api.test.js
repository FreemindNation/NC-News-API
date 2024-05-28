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
                })
            })
        })

    });
});