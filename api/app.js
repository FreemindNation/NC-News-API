const express = require('express');
const { getTopics } = require('../api/controllers/topics-controllers');
const { handleCustomErrors, handleGeneric404Errors } = require('./error-handling/handle-errors');

const app = express();


app.use(express.json());

app.get('/api/topics', getTopics);







app.use(handleCustomErrors);

app.all('*', handleGeneric404Errors);



















module.exports = app;


