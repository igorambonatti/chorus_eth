# Dockerfile
FROM node:16-alpine

WORKDIR /app

# Copia arquivos de dependências e instala as dependências necessárias
COPY package*.json ./
RUN npm install --production

# Copia o restante da aplicação
COPY . .

# Expõe a porta em que a aplicação irá rodar (ajuste se necessário)
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["npm", "start"]
