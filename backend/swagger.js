// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'sql2pyspark API',
      version: '1.0.0',
      description: 'API Documentation for sql2pyspark',
    },
    servers: [
      {
        url: 'http://localhost:5000', // เปลี่ยน URL ตามที่คุณต้องการ
      },
    ],
  },
  apis: ['./routes/*.js'], // ระบุเส้นทางของไฟล์ที่มีคอมเมนต์ Swagger
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
