exports.handleSqlErrors = (err, req, res, next) => {
    console.log(err);
  if (err.code) {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ status: err.status, msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleGeneric404Errors = (req, res) => {
  res.status(404).send({ msg: "Route not found" });
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};
