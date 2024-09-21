const { getEndpoints } = require('../controllers/endpoints-controllers');
const apiRouter = require('express').Router();
const userRouter = require('./users-router');
const articleRouter = require('./articles-router');
const topicRouter = require('./topics-router')

apiRouter.get('/', getEndpoints);

apiRouter.use('/users', userRouter);

apiRouter.use('/articles', articleRouter);

apiRouter.use('/topics', topicRouter);


module.exports = apiRouter;
