FROM node:20.17.0-alpine AS build
 
RUN addgroup -g 1001 sql2pyspark && \
    adduser -D -u 1001 -G sql2pyspark sql2pyspark
 
WORKDIR /app
 
COPY package*.json ./
 
RUN npm install
 
COPY . .

RUN chown -R sql2pyspark:sql2pyspark /app

USER sql2pyspark

EXPOSE 3000

CMD ["npm", "start"]