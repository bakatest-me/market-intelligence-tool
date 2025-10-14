# Stage 1: Build the React application
FROM node:24-slim AS build

WORKDIR /app

COPY package.json ./
RUN npm i

COPY . .
RUN npm run build --production

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built SPA files from React Router v7
COPY --from=build /app/build/client /usr/share/nginx/html

# Copy nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]