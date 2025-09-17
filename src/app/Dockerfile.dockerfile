# ===== Estágio 1: Builder =====
# Usa uma imagem Node.js para construir a aplicação
FROM node:18-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de gerenciamento de pacotes
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o resto do código da aplicação
COPY . .

# Executa o build da aplicação Next.js
RUN npm run build

# ===== Estágio 2: Runner =====
# Usa uma imagem Node.js menor para rodar a aplicação
FROM node:18-alpine AS runner

# Define o diretório de trabalho
WORKDIR /app

# Define o ambiente como produção
ENV NODE_ENV=production

# Copia os arquivos de build do estágio anterior
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expõe a porta que o Next.js usa para rodar
EXPOSE 3000

# Define o comando para iniciar a aplicação
CMD ["npm", "start"]
