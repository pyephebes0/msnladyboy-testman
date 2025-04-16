# Dockerfile
FROM node:20

WORKDIR /app

COPY . .

# Install dependencies
RUN npm install

# Build SvelteKit
RUN npm run build

EXPOSE 3000

# Start server.js
CMD ["node", "server.js"]
