# Multi-stage build for optimized Node.js React app
FROM node:18-alpine AS builder

RUN apk add --no-cache curl

# Set working directory in container
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies with optimized settings
RUN npm ci --only=production --silent

# Copy source code (excluding node_modules via .dockerignore)
COPY src/ ./src/
COPY public/ ./public/
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install curl and serve for production
RUN apk add --no-cache curl && \
    npm install -g serve

# Create app directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json

# Expose port 8090
EXPOSE 8090

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8090 || exit 1

# Start the application
CMD ["serve", "-s", "build", "-l", "8090"]
