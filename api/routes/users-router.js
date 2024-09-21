const { getUsers } = require('../controllers/users-controllers');
const userRouter = requitre('express').Router();

userRouter.get('/', getUsers);




module.exports = userRouter;