app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;
  
    try {
      const response = await axios({
        method: 'post',
        url: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION}`,
        headers: {
          'api-key': process.env.AZURE_OPENAI_API_KEY,
          'Content-Type': 'application/json',
        },
        data: {
          messages: messages,
          stream: true,
        },
        responseType: 'stream',
      });
  
      res.setHeader('Content-Type', 'text/event-stream');
      response.data.pipe(res);
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      res.status(500).send('Error processing the request');
    }
  });
  