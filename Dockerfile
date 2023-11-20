FROM node:20-alpine

WORKDIR /app

COPY package.json .

ARG NODE_ENV

RUN if [ $NODE_ENV == prod ]; then \
        npm install --only=production;  \
    else npm install; \
    fi 

COPY . .

CMD ["node", "server.js"]