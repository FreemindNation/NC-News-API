const { getArticles, getArticlesById, patchArticleById } = require('../controllers/articles-controllers');

const articleRouter = require('express').Router();

articleRouter
    .route('/')
    .get(getArticles);


articleRouter
    .route('/:article_id')
    .get(getArticlesById)
    .patch(patchArticleById);




    module.exports = articleRouter