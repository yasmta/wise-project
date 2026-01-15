FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the frontend
RUN npm run build

# Create a seed directory for the database to preserve local data
# because mounting a volume at /app/server/db will hide the image's content there.
RUN mkdir -p server/db_seed && cp -r server/db/* server/db_seed/

# Expose the API port
EXPOSE 3001

# Start script: 
# 1. Check if database.sqlite exists in the volume (it won't on first fresh deploy with volume).
# 2. If not, copy from seed.
# 3. Start server.
CMD sh -c "if [ ! -f server/db/database.sqlite ]; then echo 'Initializing DB from local seed...'; cp -r server/db_seed/* server/db/; fi && node server/index.js"
