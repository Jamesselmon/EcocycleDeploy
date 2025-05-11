FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY EcoCycle/package*.json ./
RUN npm install

# Copy the rest of the application
COPY EcoCycle/ .

# Set environment variables
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

# Expose the port
EXPOSE 3000

# Run in development mode with explicit host and port
CMD ["npm", "run", "dev", "--", "-p", "3000", "-H", "0.0.0.0"]