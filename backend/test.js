import OpenAI from 'openai';


require('dotenv').config();
const ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const API_KEY = process.env.AZURE_OPENAI_API_KEY;
const DEPLOYMENT_NAME = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
const API_VERSION = process.env.AZURE_OPENAI_API_VERSION;

const client = new OpenAI({
  apiKey: API_KEY,
  basePath: ENDPOINT + "/openai/deployments/" + DEPLOYMENT_NAME,
  baseOptions: {
    headers: {
      "api-key": API_KEY,
    },
    params: {
      "api-version": API_VERSION,
    },
  },
});

const openai = new OpenAIApi(configuration);

(async () => {
  try {
    const completion = await openai.createChatCompletion(
      {
        messages: [
          { role: "system", content: "You are a financial advisor." },
          { role: "user", content: "What's the best investment strategy?" },
        ],
        max_tokens: 200,
        temperature: 0.5,
        stream: false,
      },
      { responseType: "stream" }
    );

    const stream = completion.data;

    stream.on("data", (chunk) => {
      const payloads = chunk
        .toString()
        .split("\n\n")
        .filter(Boolean);

      for (const payload of payloads) {
        if (payload.includes("[DONE]")) {
          console.log("\nStream completed.");
          return;
        }
        if (payload.startsWith("data:")) {
          const data = payload.replace(/^data: /, "");
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0].delta.content;
            if (content) {
              process.stdout.write(content);
            }
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      }
    });

    stream.on("end", () => {
      console.log("\nStream ended.");
    });

    stream.on("error", (error) => {
      console.error("Stream error:", error);
    });
  } catch (error) {
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
      console.error("Data:", error.response.data);
    } else {
      console.error("Error Message:", error.message);
    }
  }
})();
