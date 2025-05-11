FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY EcoCycle/package*.json ./
RUN npm install

# Copy the rest of the application
COPY EcoCycle/ .

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOST=0.0.0.0

# Expose the port
EXPOSE 3000

# Run in development mode
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]