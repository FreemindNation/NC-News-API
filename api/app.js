const express = require('express');
const { getTopics } = require('../api/controllers/topics-controllers');
const { handleCustomErrors, handleGeneric404Errors, handleServerErrors } = require('./error-handling/handle-errors');

const app = express();




app.get('/api/topics', getTopics);









app.all('*', handleGeneric404Errors);

app.use(handleServerErrors);



















module.exports = app;


