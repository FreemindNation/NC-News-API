# Northcoders News API

## database connection

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

Now that you have created the environment variables you are free to clone the project and run it locally if you wish. Ensure to add the two files to a .gitignore if you wish.




--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
