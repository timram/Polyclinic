function genericError(res, err) {
  console.log(err);

  if (err && err.status) {
    return res.status(err.status).json({
      error: {
        message: err.message
      }
    });
  }

  return res.status(500).json({
    error: {
      message: 'Unexpected error'
    }
  });
}

module.exports = {
  genericError
};

