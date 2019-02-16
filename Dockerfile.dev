 FROM node:alpine
WORKDIR /usr/app
COPY package.json .
RUN npm i -g nodemon
COPY ./ ./

RUN npm install

CMD ["nodemon", "server.js"]