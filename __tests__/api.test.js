const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const db = require('../db/connection');
const request = require('supertest');
const app = require('../api/app');
const apiEndpoints = require('../endpoints.json');



beforeEach(() => seed(testData));

afterAll (()=> db.end());

describe('GET /api/topics', () => {
    test('200: responds with all available topics', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body })=> {
            const  { topics }  = body;
            
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

describe('GET /api', () => {
    test('200: responds with an object of all available endpoints', () => {
      return request(app)
      .get('/api')
      .expect(200)
      .then(({ body })=> {
        const { endpoints } = body;
        expect(endpoints).toEqual(apiEndpoints);
      })
    });

    test('404: responds with "Route not found" if passed an invalid route', () => {
        return request(app)
        .get('/not-a-valid-route')
        .expect(404)
        .then(({ body })=> {
            expect(body.msg).toBe('Route not found');
        })
    });
});

describe('GET /api/articles/:article_id', () => {
    test('200: responds with a single article matching the given id', () => {
      return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body })=> {
        const { article } = body;
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url:expect.any(String)
        })
      })
    });
  
    test('400: responds with " Bad request" if passed a non numeric id', () => {
      return request(app)
      .get('/api/articles/not-a-number')
      .expect(400)
      .then(({ body })=> {
        expect(body.msg).toBe('Bad request');
      });
    });
  
    test('404: responds with "Not found" if passed an number id that does not exist', () => {
      return request(app)
      .get('/api/articles/609')
      .expect(404)
      .then(({ body })=> {
        expect(body.msg).toBe('Not found')
      })
    });
  });

describe('GET /api/articles', () => {
    test.only('200: responds with an array of all aricle objects sorted by date in DESC order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body })=> {
            const { articles } = body;
            
            expect(articles).toHaveLength(13)

            articles.forEach((article)=> {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number)
                });
            });

            expect(articles).toBeSortedBy('created_at',{ descending: true, });
        });
    });

    test.only('404: responds with "Route not found" if passed an invalid route', () => {
      return request(app)
      .get('/api/not-a-valid-route')
      .expect(404)
      .then(({ body })=> {
          expect(body.msg).toBe('Route not found');
      })
  });
});
  


