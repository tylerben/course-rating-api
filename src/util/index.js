function handleError(err, req, res, next) {
  err.status = 400;
  return next(err);
}

module.exports = {
  handleError,
}