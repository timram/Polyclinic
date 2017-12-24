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

function notAuthorizedAccess(res) {
  console.log('not authorized access');

  return res.status(400).json({
    error: {
      message: 'Not authorized access'
    }
  });
}

module.exports = {
  genericError,
  notAuthorizedAccess
};

