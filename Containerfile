FROM oven/bun:alpine
COPY . /app
WORKDIR /app
RUN bun install