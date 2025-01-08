# Dockerfile
FROM oven/bun:latest as builder

WORKDIR /app

# Copy package files
COPY bun.lockb package.json ./

# Install dependencies
RUN bun install

# Copy the source code
COPY . .

# Build the project
# Explicitly specify entrypoint
# RUN bun build src/main.ts --outdir=dist
# RUN bun run build

RUN bun run build

# Start production image
FROM oven/bun:latest

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["bun", "dist/src/main.js"]