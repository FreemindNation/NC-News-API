# My First API

Welcome to My First API! This project is designed to demonstrate the creation and functionality of a simple RESTful API using Node.js, Express, PostgreSQL, and Jest and Supertest for testing.

## Hosted Version

You can access the hosted version of this API [here](https://nc-news-4642.onrender.com/api).

## Project Summary

My First API is a fully functional RESTful API that allows users to interact with articles and comments. Users can perform various operations such as fetching articles, posting comments, updating article votes, and deleting articles or comments. The API is built with Node.js and Express, uses PostgreSQL for data storage, and is tested with Jest along side Supertest to ensure reliability and correctness.

## Cloning the Repository

To get started with this project, you need to clone the repository to your local machine:

```
git clone https://github.com/FreemindNation/my-first-API.git
cd my-first-API
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

`PGDATABASE=nc_news_test`

Create an .env.development file in the root directory for the development database

`.env.development`

Then add the development database environment variable as follow

`PGDATABASE=nc_news`

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

Thank you for checking out My First API! If you have any questions or run into any issues, feel free to open an issue on the repository. See you on the other side!


--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
