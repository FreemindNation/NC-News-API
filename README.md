# NC-News-API

Welcome to NC-News-API! This project is designed to demonstrate the creation and functionality of a simple RESTful API using Node.js, Express, PostgreSQL, and Jest and Supertest for testing.

## Hosted Version

You can access the hosted version of this API [here](https://nc-news-4642.onrender.com/api).

## Project Summary

NC-News-API is a fully functional RESTful API that allows users to interact with articles and comments. Users can perform various operations such as fetching articles, posting comments, updating article votes, and deleting articles or comments. The API is built with Node.js and Express, uses PostgreSQL for data storage, and is tested with Jest along side Supertest to ensure reliability and correctness.

## Available endpoints


| **Endpoint**                             | **Description**                                                                 | **Queries**                           | **Example Response**                                                                                                                                                                                                                                                                                                                                                               |
|------------------------------------------|---------------------------------------------------------------------------------|---------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GET /api`                               | Serves a JSON representation of all available endpoints of the API.             | []                                    | N/A                                                                                                                                                                                                                                                                                                                                                                                |
| `GET /api/topics`                        | Serves an array of all topics.                                                  | []                                    | `{ "topics": [{ "slug": "football", "description": "Footie!" }] }`                                                                                                                                                                                                                                                                                                                 |
| `GET /api/articles`                      | Serves an array of all articles. Can query by topic, sort_by, order, limit, and page. | ["topic", "sort_by", "order", "limit", "page"] | `{ "articles": [{ "title": "Seafood substitutions are increasing", "topic": "cooking", "author": "weegembump", "article_id": 33, "body": "Text from the article..", "created_at": "2018-05-30T15:59:13.341Z", "votes": 0, "article_img_url": "https://images.pexels.com/photos/2403392/pexels-photo-2403392.jpeg?w=700&h=700", "comment_count": 6 }], "total_count": 12, "totalPages": 2, "currentPage": 2, "limit": 10, "prevPage": 1, "nextPage": null }` |
| `GET /api/articles/:article_id`          | Serves an article matching the given article_id.                                | []                                    | `{ "article": { "author": "John Doe", "title": "The Future of Tech", "article_id": 12345, "body": "This is a sample article about the future of technology.", "topic": "Technology", "created_at": "2024-05-29T12:34:56Z", "votes": 100, "article_img_url": "https://example.com/image.jpg", "comment_count": 6 } }`                                                                 |
| `GET /api/articles/:article_id/comments` | Serves an array of comments for the given article id.                           | ["limit", "page"]                     | `{ "comments": [{ "comment_id": 1, "body": "This is a body of the comment.", "votes": 10, "author": "JohnDoe", "article_id": 23, "created_at": "2024-05-29T12:34:56Z" }], "total_count": 11, "totalPages": 2, "currentPage": 2, "limit": 10, "prevPage": 1, "nextPage": null }`                                                                                                           |
| `POST /api/articles/:article_id/comments`| Adds a comment to an article by article id and responds with the added comment. | []                                    | `{ "newComment": { "comment_id": 1, "votes": 0, "created_at": "2024-05-30T12:34:56Z", "author": "butter_bridge", "body": "This is a new comment", "article_id": 1 } }`                                                                                                                                                                                                              |
| `PATCH /api/articles/:article_id`        | Increments the vote of a specified article by the given value and responds with the updated article. | []                                    | `{ "updatedArticle": { "author": "John Doe", "title": "The Future of Tech", "article_id": 12345, "body": "This is a sample article about the future of technology.", "topic": "Technology", "created_at": "2024-05-29T12:34:56Z", "votes": 100, "article_img_url": "https://example.com/image.jpg" } }`                                          |
| `DELETE /api/comments/:comment_id`       | Deletes a comment by the given comment id. No response given.                  | []                                    | N/A                                                                                                                                                                                                                                                                                                                                                                                |
| `GET /api/users`                         | Serves an array of all users.                                                   | []                                    | `[ { "username": "rogue007", "name": "John", "avatar_url": "https://avatars2.githubusercontent.com/u/24343918?s=400&v=4" }, { "username": "lukeCage001", "name": "do_everyrhing", "avatar_url": "https://www.golenbock.com/wp-content/uploads/2024/01/placeholder-user.png" } ]`                                                               |
| `GET /api/users/:username`               | Serves a user matching the given username.                                      | []                                    | `{ "user": { "username": "lukeCage001", "name": "do_everyrhing", "avatar_url": "https://www.golenbock.com/wp-content/uploads/2024/01/placeholder-user.png" } }`                                                                                                                                                                              |
| `PATCH /api/comments/:comments_id`       | Increments the vote of a specified comment by the given value and responds with the updated comment. | []                                    | `{ "updatedArticle": { "comment_id": 1, "body": "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!", "votes": 17, "author": "butter_bridge", "article_id": 9, "created_at": "2020-04-06T12:17:00.000Z" } }`                                                                                                  |
| `POST /api/articles`                     | Adds a new article with the given post body and responds with the added article. | []                                    | `{ "newArticle": { "article_id": 14, "title": "Understanding JavaScript Objects", "topic": "mitch", "author": "butter_bridge", "body": "This article explains the basics of JavaScript objects, including how to create, modify, and access object properties.", "created_at": "2024-09-24T14:39:45.645Z", "votes": 0, "article_img_url": "https://example.com/default-image.jpg", "comment_count": 0 } }` |
| `POST /api/topics`                       | Adds a new topic and responds with the added topic.                             | []                                    | `{ "newTopic": { "slug": "music", "description": "the essence of life" } }`                                                                                                                                                                                                                                                                   |
| `DELETE /api/articles/:article_id`       | Deletes an article and its related comments.                                    | []                                    | N/A                                                                                                                                                                                                                                                                                                                                                                                |

## Cloning the Repository

To get started with this project, you need to clone the repository to your local machine:

```
git clone https://github.com/FreemindNation/NC-News-API.git
cd NC-News-API
```

## Installing Dependencies

Before running the project, you need to install the required dependencies. Make sure you have Node.js and npm installed on your machine. You can install the dependencies using the following command:

`npm install`

## Setting Up the Database

Ensure you have PostgreSQL installed on your machine. The minimum required version is PostgreSQL 12.


### Database connection

In order to successfully connect to the two databases used locally you must add .env files to have access to the environment variables.
 
Follow these instructions to create the above files:

Create a .env.test file in the root directory for the test database

`.env.test`

Then add the test database enviroment variable as follow :

`PGDATABASE=test_database_name_here`

Create an .env.development file in the root directory for the development database

`.env.development`

Then add the development database environment variable as follow

`PGDATABASE=development_database_name_here`

You can then set up your databases by running the following command:

`npm setup-dbs`

### Seeding the Local Database

After setting up your environment variables, you can seed your local database with the initial data. Use the following command to run the seed script:


`npm run seed`

### Running the Tests

To ensure everything is set up correctly and the application is working as expected, run the tests using Jest:

`npm test api`


## Minimum Versions

To run this project, you need to have the following minimum versions of Node.js and PostgreSQL installed:

- Node.js: v14.0.0
- PostgreSQL: v12.0

## Conclusion

Thank you for checking out NC-News API! If you have any questions or run into any issues, feel free to open an issue on the repository. See you on the other side!


--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
