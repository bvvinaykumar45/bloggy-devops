# syntax=docker/dockerfile:1
FROM node:22

# Set working directory
WORKDIR /app

# Install dependency
COPY package*.json ./
RUN npm install

# Copying application code
COPY . .

COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Expose port
EXPOSE 3000

# Start in dev mode
# CMD ["npm", "run", "dev"]

ENTRYPOINT [ "wait-for-it.sh", "blog-db:3306", "--" ]
CMD ["npm", "run", "dev"]