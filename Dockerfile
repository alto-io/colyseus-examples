FROM node:16-alpine AS builder
WORKDIR /builder
COPY package*.json ./
RUN npm ci
ENV PORT 2567
EXPOSE $PORT
COPY . .
RUN npm run build

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /builder/dist ./dist
COPY --from=builder /builder/node_modules ./node_modules
COPY --from=builder /builder/package.json ./package.json

CMD [ "npm", "start" ]