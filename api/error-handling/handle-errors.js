

exports.handleCustomErrors = (err, req, res, next)=> {
    if(err.status && err.msg) {
        res.status(404).send({status: err.status, msg: err.msg});
    }
    else {
        next(err);
    }
}

exports.handleSqlErrors = (err, req, res, next)=> {
    if(err.code === '22P02' || err.code === '23503' || err.code === '23502') {
        res.status(400).send({ msg: 'Bad request' });
    }
    else {
        next(err);
    }
}


exports.handleGeneric404Errors = (req, res)=> {

    res.status(404).send({msg: 'Route not found'});
}



exports.handleServerErrors = (err, req, res, next)=> {
    res.status(500).send({msg: 'Internal server error'})
}