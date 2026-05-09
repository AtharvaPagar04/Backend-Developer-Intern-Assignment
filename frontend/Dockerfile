# ─── Build stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ─── Production image (nginx) ─────────────────────────────────────────────────
FROM nginx:stable-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html

# Simple nginx config that forwards /api/* to the backend
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / { try_files $uri $uri/ /index.html; }\n\
    location /api/ { proxy_pass http://backend:5000; }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
