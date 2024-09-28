
FROM node:20.17.0-alpine

ENV NODE_ENV=production

RUN addgroup -g 1001 sql2pyspark && \
    adduser -D -u 1001 -G sql2pyspark sql2pyspark

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN chown -R sql2pyspark:sql2pyspark /app

USER sql2pyspark

EXPOSE 5001

CMD ["node", "app.js"]