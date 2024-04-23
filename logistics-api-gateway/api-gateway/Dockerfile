# Stage 1: Build and dependency installation
FROM node:20.12.2-bullseye-slim as builder

# Install 'dumb-init'
RUN apt-get update \
    && apt-get install -y --no-install-recommends dumb-init \
    && rm -rf /var/lib/apt/lists/*

# Create working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy the rest of the application code
COPY . .

# Build TypeScript code
RUN npm run build

# Clean up devDependencies
RUN npm prune --production

# Change ownership to node user
RUN chown -R node:node /app

# ----------------------------------------------------------------------------------------------------
# ----------------------------------------------------------------------------------------------------

# Stage 2: Setup production environment
FROM node:20.12.2-bullseye-slim

# Install 'dumb-init'
RUN apt-get update \
    && apt-get install -y --no-install-recommends dumb-init \
    && rm -rf /var/lib/apt/lists/*

# Set environment to production
ENV NODE_ENV production

# Create app directory
WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci && npm cache clean --force

# Use non-root user
USER node

# Expose application port
EXPOSE 5001

# Healthcheck for application
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD ["node", "healthcheck.ts"]

# Start application
CMD ["dumb-init", "npm", "start"]