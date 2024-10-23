exports.healthCheck = (res) => {
    res.status(200).json({
      status: 'OK'
    });
  };
  