// controllers/openaiController.js
const { Configuration, OpenAIApi } = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  basePath: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
});

const openai = new OpenAIApi(configuration);

exports.convertSQLToPySpark = async (req, res) => {
  const { sqlQuery } = req.body;
  try {
    const response = await openai.createCompletion(
      {
        prompt: `${process.env.AZURE_OPENAI_PROMPT}\n\n${sqlQuery}`,
        max_tokens: 500,
        temperature: 0.5,
      },
      {
        headers: {
          'api-key': process.env.AZURE_OPENAI_API_KEY,
          'Content-Type': 'application/json',
        },
        params: {
          'api-version': process.env.AZURE_OPENAI_API_VERSION,
        },
      }
    );

    const pysparkCode = response.data.choices[0].text;

    res.json({ pysparkCode });
  } catch (error) {
    console.error('API Error:', error);
    console.error('Error Response:', error.response);
    console.error('Error Data:', error.response.data);
    res.status(500).json({ error: 'There was an error in convert SQL to PySpark' });
  }
};
