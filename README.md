# Project Overview
This project utilizes the SQL2Spark API to convert SQL Statement to Pyspark Syntex using Azure OpenAI. The API is running on port `5001` and the frontend is running on port `3000`.

## Environment Variables
The following environment variable is required to run the project:

### Frontend environment variables
* `REACT_APP_SQL2SPARK_API`: The URL of the SQL2Spark API. Set to `http://localhost:5001` by default.

### Backend API environment variables
* `AZURE_OPENAI_API_KEY`
* `AZURE_OPENAI_ENDPOINT`
* `AZURE_OPENAI_DEPLOYMENT_NAME`
* `AZURE_OPENAI_API_VERSION`
* `AZURE_OPENAI_PROMPT`

## Getting Started
To get started with the project, follow these steps:

### 1. Clone the repository
Clone the repository to your local machine using `git clone <repository-url>`.

### 2. Install dependencies
Install the required dependencies using `npm install` or `yarn install`.

### 3. Start the services
Start the services using `node app.js` or `npm start`. This will start the Express server and Socket.IO.

### 4. Access the API
Access the API at `http://<API_URL>>:5001` in your web browser or using a tool like Postman.
