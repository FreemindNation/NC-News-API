const { getEndpoint } = require('../controllers/endpoints-controllers');
const apiRouter = require('express').Router();
const userRouter = require('./users-router')


apiRouter.get('/', getEndpoint);

apiRouter.use('/users', userRouter);


module.exports = apiRouter;
