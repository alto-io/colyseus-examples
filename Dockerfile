FROM node:16-alpine

ENV PORT 2567

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

EXPOSE 2567

COPY . .

RUN npm run build

CMD [ "npm", "start" ]
