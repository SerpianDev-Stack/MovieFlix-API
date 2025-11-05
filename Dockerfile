FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Gera o client do Prisma
RUN npx prisma generate

# Compila o TypeScript
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
