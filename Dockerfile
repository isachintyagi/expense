FROM node:alpine as builder
WORKDIR /usr/app
COPY package.json .
RUN npm i -g nodemon
COPY ./ ./

RUN npm install

CMD ["nodemon", "server.js"]

FROM nginx
EXPOSE 80
COPY --from=builder /usr/app /user/share/nginx