# Dockerfile for Barangay Bantay
FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies first for better caching
COPY package.json package-lock.json* ./
RUN npm install

# Copy app sources and build frontend
COPY . .
RUN npm run build

# Expose the port used by the server
EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

# Run the backend server
CMD ["npx", "tsx", "server/index.ts"]
