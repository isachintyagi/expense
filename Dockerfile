FROM node:alpine as builder
WORKDIR '/app'
COPY package.json .
COPY . .
RUN npm install
CMD ["node", "server.js"]

EXPOSE 8000

