
exports.handleGeneric404Errors = (req, res)=> {
    res.status(404).send({msg: 'Route not found'});
}

exports.handleServerErrors = (error, req, res, next)=> {
    res.status(500).send({msg: 'Internal server error'})
}