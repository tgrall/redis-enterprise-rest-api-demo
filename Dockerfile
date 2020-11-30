FROM node:10

WORKDIR /usr/src/app`

COPY package*.json ./

RUN npm install
COPY . .

ENV REST_HOST=
ENV REST_USER=
ENV REST_PASSWORD=

EXPOSE 3000

CMD ["npm", "start"]