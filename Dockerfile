# Usa Node 18 para construir a aplicação
FROM node:18 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx tsc

FROM gcr.io/distroless/nodejs18

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules

EXPOSE $PORT
CMD ["dist/main"]
