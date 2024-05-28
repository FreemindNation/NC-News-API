exports.handleCustomErrors = (err, req, res, next) => {
    
    if(err.status && err.msg) {
        res.status(404).send({status: err.status, msg: err.msg});
    }
    else {
        next(err);
    }
}

exports.handleGeneric404Errors = (req, res)=> {
    res.status(404).send({msg: 'Route not found'});
}