exports.errorHandler = (err, res) => {
    console.error(err.stack);
    res.status(500).json({
      message: 'Internal Server Error',
      error: err.message,
    });
  };
  