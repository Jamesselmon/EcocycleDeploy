FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY EcoCycle/package*.json ./
RUN npm install

# Copy the rest of the application
COPY EcoCycle/ .

# Build for production
RUN npm run build

# Set environment variables
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Expose the port
EXPOSE 3000

# Use production start command
CMD ["npm", "start"]