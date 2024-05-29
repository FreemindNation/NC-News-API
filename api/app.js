const express = require('express');
const { getTopics } = require('./controllers/topics-controllers');
const { handleGeneric404Errors, handleServerErrors } = require('./error-handling/handle-errors');
const { getEndpoints } = require('./controllers/endpoints-controllers');

const app = express();




app.get('/api/topics', getTopics);

app.get('/api', getEndpoints);





app.all('*', handleGeneric404Errors);

app.use(handleServerErrors);



















module.exports = app;


