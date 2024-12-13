# # Gunakan image Node.js sebagai base image
# FROM node:20

# # Set working directory di dalam container
# WORKDIR /app

# # Salin file package.json dan package-lock.json
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Salin semua file dari repositori ke dalam container
# COPY . .

# # Build aplikasi Vite
# RUN npm run build

# # Expose port 3040 (port default Vite)
# EXPOSE 3040

# # Jalankan aplikasi dengan Vite
# # CMD ["npm", "run", "preview", "--", "--port", "5173",  "--host", "0.0.0.0"]

# CMD ["npm", "run", "preview"]

# Stage 1: Build
FROM node:21 AS builder

WORKDIR /app

# Copy package.json dan install dependencies
COPY package*.json ./
RUN npm install

# Copy seluruh proyek dan lakukan build
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:21

WORKDIR /app

# Hanya salin file build hasil dari stage 1
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install hanya dependencies yang diperlukan untuk production
RUN npm install

# Expose port yang digunakan oleh Vite preview (default 4173)
EXPOSE 4173

# Jalankan preview production
CMD ["npm", "run", "preview"]

