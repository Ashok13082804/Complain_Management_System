# Stage 1: Build React App
FROM node:18-alpine AS build

WORKDIR /app

# Install Dependencies
COPY package*.json ./
RUN npm install

# Build App
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy Build Artifacts
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx Config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
