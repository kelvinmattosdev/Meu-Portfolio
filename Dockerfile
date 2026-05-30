FROM oven/bun:1-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

RUN rm -rf src node_modules

RUN bun install --frozen-lockfile --production

EXPOSE 3000

USER bun

CMD ["bun", "run", "start"]