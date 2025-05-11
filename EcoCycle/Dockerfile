FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY EcoCycle/package*.json ./
RUN npm install

# Copy the rest of the application
COPY EcoCycle/ .

# Set environment variables - Note this needs to come BEFORE the build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build with the environment variables
RUN npm run build

# Set runtime environment variables
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]