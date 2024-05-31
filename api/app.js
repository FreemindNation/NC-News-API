const express = require('express');
const { getTopics } = require('./controllers/topics-controllers');
const { handleGeneric404Errors, handleServerErrors, handleCustomErrors, handleSqlErrors } = require('./error-handling/handle-errors');
const { getEndpoints } = require('./controllers/endpoints-controllers');
const { getArticlesById, getArticles, patchArticleById } = require('./controllers/articles-controllers');
const { getCommentsByArticleId, postCommentByArticleId, deleteCommentById } = require('./controllers/comments-controllers');

const app = express();

app.use(express.json());


app.get('/api/topics', getTopics);

app.get('/api', getEndpoints);

app.get('/api/articles/:article_id', getArticlesById);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postCommentByArticleId);

app.patch('/api/articles/:article_id', patchArticleById);

app.delete('/api/comments/:comment_id', deleteCommentById)



app.use(handleSqlErrors);

app.use(handleCustomErrors);

app.all('*', handleGeneric404Errors);

app.use(handleServerErrors);




















module.exports = app;


