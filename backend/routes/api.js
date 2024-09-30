// routes/api.js
const express = require('express');
const router = express.Router();
const openaiController = require('../controllers/.openaiController.js2');

/**
 * @swagger
 * /api/convert:
 *   post:
 *     summary: Convert SQL query to PySpark code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sqlQuery:
 *                 type: string
 *                 description: The SQL query to be converted
 *                 example: SELECT * FROM users WHERE age > 30;
 *     responses:
 *       200:
 *         description: PySpark code generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pysparkCode:
 *                   type: string
 *                   description: The converted PySpark code
 *                   example: |
 *                     from pyspark.sql.functions import col
 *                     
 *                     df.filter(col('age') > 30).select('*')
 *       500:
 *         description: Server error
 */

router.get('/healthcheck', (req, res) => {
  res.status(200).send({ message: 'OK' });
});

router.post('/convert', openaiController.convertSQLToPySpark);

module.exports = router;