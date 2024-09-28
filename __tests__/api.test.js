const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../api/app");
const apiEndpoints = require("../endpoints.json");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("200: responds with all available topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;

        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });

  test('404: responds with "Route not found" if passed an invalid route', () => {
    return request(app)
      .get("/api/not-a-valid-route")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

describe("GET /api", () => {
  test("200: responds with an object of all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endpoints } = body;
        expect(endpoints).toEqual(apiEndpoints);
      });
  });

  test('404: responds with "Route not found" if passed an invalid route', () => {
    return request(app)
      .get("/not-a-valid-route")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with a single article matching the given id and including a comment_count key with total comments with given id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 11,
        });
      });
  });

  test('400: responds with "Bad request" if passed a non numeric id', () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test('404: responds with "Not found" if passed an number id that does not exist', () => {
    return request(app)
      .get("/api/articles/609")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an array of all aricle objects sorted by date in DESC order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        expect(articles).toHaveLength(13);

        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });

        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("200: responds with articles filtered by the topic query provided", () => {
    return request(app)
      .get("/api/articles")
      .query({ topic: "mitch" })
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: "mitch",
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  test("200: responds with articles sorted by votes in ascending order", () => {
    return request(app)
      .get("/api/articles")
      .query({ sort_by: "votes", order: "asc" })
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("votes");
      });
  });

  test("200: responds with an array of all aricle objects sorted by date in DESC order", () => {
    return request(app)
      .get("/api/articles")
      .query({ sort_by: "comment_count", order: "desc" })
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        expect(articles).toHaveLength(13);

        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });

        expect(articles).toBeSortedBy("comment_count", { descending: true });
      });
  });

  test("200: responds with an array of all aricle objects with topic of mitch sorted by date in DESC order", () => {
    return request(app)
      .get("/api/articles")
      .query({ topic: "mitch", sort_by: "comment_count", order: "desc" })
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        expect(articles).toHaveLength(12);

        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: "mitch",
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });

        expect(articles).toBeSortedBy("comment_count", { descending: true });
      });
  });

  test('200: responds with an array of articles with a limit set and starting from a set page and all the metadata', () => {
    return request(app)
    .get('/api/articles')
    .query({ limit: 10, page: 1 })
    .expect(200)
    .then(({ body })=> {
      const { articles, total_count, totalPages, currentPage, limit  } = body;
    
      expect(articles.length).toBeLessThanOrEqual(10)
      expect(total_count).toBe(13)
      expect(totalPages).toBe(2)
      expect(currentPage).toBe(1)
      expect(limit).toBe(10)

      articles.forEach((article) => {
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        });
      });
    })
  });

  test('400: responds with "Bad request" if limit or page queries are non numeric', () => {
    return request(app)
      .get("/api/articles")
      .query({ limit: "invalid", page: 'not a number' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test('400: responds with "Bad request" if limit or page queries are negative numbers', () => {
    return request(app)
      .get("/api/articles")
      .query({ limit: -10, page: -2 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test('400: responds with "Bad request" if limit query exceeds max allowed value', () => {
    return request(app)
      .get("/api/articles")
      .query({ limit: 101, page: 2 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test('404: responds with "Page not found" if page query exceeds max allowed value', () => {
    return request(app)
      .get("/api/articles")
      .query({ limit: 10, page: 4 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Page not found");
      });
  });

  test('400: responds with "Bad request" if sort_by query is invalid', () => {
    return request(app)
      .get("/api/articles")
      .query({ sort_by: "invalid" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test('400: responds with "Bad request" if sort_by query is of wrong data type', () => {
    return request(app)
      .get("/api/articles")
      .query({ sort_by: 5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test('400: responds with "Bad request" if order query is invalid', () => {
    return request(app)
      .get("/api/articles")
      .query({ order: "invalid" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test('400: responds with "Bad request" if order query is of wrong datatype', () => {
    return request(app)
      .get("/api/articles")
      .query({ order: 4 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test('404: responds with "Articles not found" if no articles match the topic', () => {
    return request(app)
      .get("/api/articles")
      .query({ topic: "gdfhrth" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Articles not found");
      });
  });

  test('404: responds with "Articles not found" if topic query is of wrong data type', () => {
    return request(app)
      .get("/api/articles")
      .query({ topic: 4 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Articles not found");
      });
  });


  test('404: responds with "Route not found" if passed an invalid route', () => {
    return request(app)
      .get("/api/not-a-valid-route")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with a list of all comments by the given id sorted by date in descinding order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;

        expect(comments).toHaveLength(11);
        expect(comments).toBeSortedBy("created_at", { descending: true });

        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            article_id: 1,
            created_at: expect.any(String),
          });
        });
      });
  });

  test('200: responds with aclist of comments based on limit and page queries provided', () => {
    return request(app)
    .get('/api/articles/1/comments')
    .query({ limit: 10, page: 2 })
    .expect(200)
    .then(({ body })=> {
      const { comments } = body;

      expect(comments.length).toBeLessThanOrEqual(10)

      comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          body: expect.any(String),
          votes: expect.any(Number),
          author: expect.any(String),
          article_id: 1,
          created_at: expect.any(String),
        });
      });
    })
  });

  test('400: responds with "Bad request" if limit or page queries are non numeric', () => {
    return request(app)
      .get("/api/articles/1/comments")
      .query({ limit: "invalid", page: 'not a number' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test('400: responds with "Bad request" if limit or page queries are negative numbers', () => {
    return request(app)
      .get("/api/articles/1/comments")
      .query({ limit: -10, page: -2 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test('400: responds with "Bad request" if limit query exceeds max allowed value', () => {
    return request(app)
      .get("/api/articles/1/comments")
      .query({ limit: 101, page: 2 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test('404: responds with "Page not found" if page query exceeds max allowed value', () => {
    return request(app)
      .get("/api/articles/1/comments")
      .query({ limit: 10, page: 4 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Page not found");
      });
  });

  test('400: responds with " Bad request" if passed a non numeric id', () => {
    return request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test('404: responds with "Article not found" if passed a non existent article id', () => {
    return request(app)
      .get("/api/articles/4561/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: adds a comment to the article of the given id and responds with the added comment", () => {
    const postBody = {
      username: "butter_bridge",
      body: "This is a new comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(postBody)
      .expect(201)
      .then(({ body }) => {
        const { newComment } = body;
        expect(newComment).toMatchObject({
          comment_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          author: "butter_bridge",
          body: "This is a new comment",
          article_id: 1,
        });
      });
  });

  test('400: responds with "Bad request" if passed an invalid article_id', () => {
    const postBody = {
      username: "butter_bridge",
      body: "This is a new comment",
    };
    return request(app)
      .post("/api/articles/456/comments")
      .send(postBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test('400: responds with "Bad request" if post body contains invalid types', () => {
    const postBody = {
      username: 3,
      body: "This is a new comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(postBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test('400: responds with "Bad request" when body is missing fields', () => {
    const postBody = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(postBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: updates an article by the given id and responds with the updated article", () => {
    const updateBody = {
      inc_vote: 100,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(updateBody)
      .expect(200)
      .then(({ body }) => {
        const { updatedArticle } = body;
        expect(updatedArticle).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 200,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test('400: responds with "Bad request" when Body is missing fields', () => {
    const patchBody = {};
    return request(app)
      .patch("/api/articles/1")
      .send(patchBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test('400: responds with "Bad request" when Body with incorrect data type', () => {
    const patchBody = {
      inc_vote: "not-a-number",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(patchBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test('404: responds with "Article not found" if passed non existent id', () => {
    const patchBody = {
      inc_vote: 100,
    };
    return request(app)
      .patch("/api/articles/8999")
      .send(patchBody)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test('400: responds with "Bad request" if passed non numeric id', () => {
    const patchBody = {
      inc_vote: 100,
    };
    return request(app)
      .patch("/api/articles/not-a-number")
      .send(patchBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: delete a comment by the given comment id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test('400: responds with "Bad request" if passed a non numeric comment id', () => {
    return request(app)
      .delete("/api/comments/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test('404: responds with "Comment not found" if passed a numberic but non existent comment id', () => {
    return request(app)
      .delete("/api/comments/55655")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with all available users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });

  test('404: responds with "Route not found" if passed an invalid route', () => {
    return request(app)
      .get("/api/not-a-valid-route")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: responds with user by the given username", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toMatchObject({
          username: "lurker",
          name: "do_nothing",
          avatar_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        });
      });
  });

  test('404: responds with "User not found" if passed a username that does not exist', () => {
    return request(app)
      .get("/api/users/not-a-username")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
});

describe("PATCH: /api/comments/:comment_id", () => {
  test("200: responds with a comment with the votes property incremented by the given inc_votes value", () => {
    const patchBody = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/comments/1")
      .send(patchBody)
      .expect(200)
      .then(({ body }) => {
        const { updatedComment } = body;
        expect(updatedComment).toMatchObject({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 17,
          author: "butter_bridge",
          article_id: 9,
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });

  test('400: responds with "Bad request" when Body is missing fields', () => {
    const patchBody = {};
    return request(app)
      .patch("/api/comments/1")
      .send(patchBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test('400: responds with "Bad request" when Body with incorrect data type', () => {
    const patchBody = {
      inc_vote: "not-a-number",
    };
    return request(app)
      .patch("/api/comments/1")
      .send(patchBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test('404: responds with "Comment not found" if passed non existent id', () => {
    const patchBody = {
      inc_vote: 100,
    };
    return request(app)
      .patch("/api/comments/100000")
      .send(patchBody)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });

  test('400: responds with "Bad request" if passed non numeric id', () => {
    const patchBody = {
      inc_vote: 100,
    };
    return request(app)
      .patch("/api/comments/not-a-number")
      .send(patchBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST: /api/articles", () => {
  test("201: adds a new article with the provided body and responds with the added article", () => {
    const postBody = {
      author: "butter_bridge",
      title: "Understanding JavaScript Objects",
      body: "This article explains the basics of JavaScript objects, including how to create, modify, and access object properties.",
      topic: "mitch",
      article_img_url: "https://example.com/default-image.jpg",
    };
    return request(app)
      .post("/api/articles")
      .send(postBody)
      .expect(201)
      .then(({ body }) => {
        const { newArticle } = body;
        expect(newArticle).toMatchObject({
          article_id: 14,
          author: "butter_bridge",
          title: "Understanding JavaScript Objects",
          body: "This article explains the basics of JavaScript objects, including how to create, modify, and access object properties.",
          topic: "mitch",
          votes: 0,
          created_at: expect.any(String),
          comment_count: 0,
          article_img_url: "https://example.com/default-image.jpg",
        });
      });
  });

  test('400: responds with "Bad request" if the post body contains invalid types', () => {
    const postBody = {
      author: 1,
      title: "Understanding JavaScript Objects",
      body: "This article explains the basics of JavaScript objects, including how to create, modify, and access object properties.",
      topic: "mitch",
      article_img_url: "https://example.com/default-image.jpg",
    }
    return request(app)
    .post("/api/articles")
    .send(postBody)
    .expect(400)
    .then(({ body })=> {
      expect(body.msg).toBe('Bad request')
    })
  });

  test('400: responds with "Bad request" if the post body is missing fields', () => {
    const postBody = {
      title: "Understanding JavaScript Objects",
      body: "This article explains the basics of JavaScript objects, including how to create, modify, and access object properties.",
      topic: "mitch",
      article_img_url: "https://example.com/default-image.jpg",
    }
    return request(app)
    .post("/api/articles")
    .send(postBody)
    .expect(400)
    .then(({ body })=> {
      expect(body.msg).toBe('Bad request')
    })
  });

  test('400: responds with "Bad Request" if the post body contains invalid types', () => {
    const postBody = {
      author: 1,
      title: "Understanding JavaScript Objects",
      body: "This article explains the basics of JavaScript objects, including how to create, modify, and access object properties.",
      topic: "mitch",
      article_img_url: "https://example.com/default-image.jpg",
    }
    return request(app)
    .post("/api/articles")
    .send(postBody)
    .expect(400)
    .then(({ body })=> {
      expect(body.msg).toBe('Bad request')
    })
  });
});

describe('POST: /api/topics', () => {
  test.only(' Adds a new topic and responds with an object containing the newly added topic', () => {
    const postBody = {
      slug: 'music',
      description: 'the essence of life'
    }

    return request(app)
    .post('/api/topics')
    .send(postBody)
    .expect(201)
    .then(({ body })=> {
      const { newTopic } = body;

      expect(newTopic).toMatchObject({
        slug: 'music',
        description: 'the essence of life'
      })
    })
  });
});
