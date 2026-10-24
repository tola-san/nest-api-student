# Stage 1: Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install OpenSSL required by Prisma
RUN apk add --no-cache openssl

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the application files and build
COPY . .
RUN npm run build

# Stage 2: Production Runtime Stage
FROM node:22-alpine AS runner

WORKDIR /app

# Install OpenSSL in the runtime image
RUN apk add --no-cache openssl

ENV NODE_ENV=production

# Copy built artifacts and node_modules from builder stage
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
