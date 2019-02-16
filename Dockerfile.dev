FROM node:alpine as builder
WORKDIR /usr/app
COPY package.json .
RUN npm i -g nodemon
COPY ./ ./
RUN npm install
CMD ["nodemon", "server.js"]

EXPOSE 80

