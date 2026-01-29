# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source & config
COPY tsconfig.json ./
COPY src ./src

# Build TS -> JS
RUN npm run build


# ---------- Runtime stage ----------
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy only needed files
COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

# App runs on this port
EXPOSE 3000

# Start the app
CMD ["node", "dist/index.js"]
