# Gunakan image Node.js sebagai base image
FROM node:20

# Set working directory di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file dari repositori ke dalam container
COPY . .

# Build aplikasi Vite
RUN npm run build

# Expose port 3040 (port default Vite)
EXPOSE 3040

# Jalankan aplikasi dengan Vite
# CMD ["npm", "run", "preview", "--", "--port", "5173",  "--host", "0.0.0.0"]

CMD ["npm", "run", "preview"]


