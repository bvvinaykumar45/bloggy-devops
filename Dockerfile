#syntax=docker/dockerfile:1

FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

RUN npm prune --omit-dev

FROM node:22-alpine AS runner

WORKDIR /app

RUN apk add --no-cache wget

COPY --from=builder /app/dist ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

EXPOSE 3000

RUN adduser -D appuser
USER appuser

ENTRYPOINT [ "wait-for-it.sh" ]
CMD ["node", "index.js"]