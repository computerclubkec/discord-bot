# =============================================================================
# Dockerfile for Discord Bot
# =============================================================================
# This Dockerfile sets up a containerized environment for a Discord bot.
# It uses the official Node.js LTS image, installs dependencies,
# and copies the bot's source code into the container.
# =============================================================================

# Use the official Node.js LTS image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of your code
COPY . .

# Run command registration script first
RUN node commands.js

# Default command to run your bot
CMD ["node", "index.js"]
