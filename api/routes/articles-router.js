const { getArticles, getArticlesById, patchArticleById } = require('../controllers/articles-controllers');
const { postCommentByArticleId, getCommentsByArticleId } = require('../controllers/comments-controllers')

const articleRouter = require('express').Router();

articleRouter
    .route('/')
    .get(getArticles);


articleRouter
    .route('/:article_id')
    .get(getArticlesById)
    .patch(patchArticleById);

articleRouter
    .route('/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(postCommentByArticleId)




    module.exports = articleRouter