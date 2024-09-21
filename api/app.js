const express = require('express');
const { handleGeneric404Errors, handleServerErrors, handleCustomErrors, handleSqlErrors } = require('./error-handling/handle-errors');
const cors = require('cors');
const apiRouter = require('./routes/api-router');


const app = express();

app.use(cors());

app.use(express.json());


app.use('/api', apiRouter);


app.use(handleSqlErrors);

app.use(handleCustomErrors);

app.all('*', handleGeneric404Errors);

app.use(handleServerErrors);










module.exports = app;


