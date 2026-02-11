# Build Stage
FROM node:18-alpine

# Create App Directory
WORKDIR /app

# Install Dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy Source Code
COPY . .

# Expose API Port
EXPOSE 5000

# Start Command
CMD ["npm", "start"]
