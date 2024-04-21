# Stage 1: Build and dependency installation
FROM node:20.12.2-bullseye-slim as builder

# Install 'dumb-init'
RUN apt-get update \
    && apt-get install -y --no-install-recommends dumb-init \
    && rm -rf /var/lib/apt/lists/*

# Setting 'production' setting for NODE environment
ENV NODE_ENV production

# Create working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

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

# Copy from builder stage
COPY --from=builder --chown=node:node /app .

# Use non-root user
USER node

# Expose application port
EXPOSE 3000

# Healthcheck for application
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD ["node", "healthcheck.ts"]

# Start application
CMD ["dumb-init", "npm", "start"]