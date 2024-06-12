FROM oven/bun:alpine
RUN mkdir /app
COPY . /app
WORKDIR /app
RUN bun install
ENTRYPOINT ["/bin/sh"]
CMD ["entrypoint.sh"]