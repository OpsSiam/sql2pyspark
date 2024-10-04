// controllers/uploadController.js

exports.uploadHandler = (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    res.json({
      filename: req.file.filename,
      originalName: req.file.originalname,
    });
  };
  