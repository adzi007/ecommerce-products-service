# Dockerfile
# Use Bun for building the application
FROM oven/bun:latest AS builder

WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .

# Build and verify output
RUN bun run build
RUN find /app -name "main.js"  # This will show where the file is actually built

FROM oven/bun:latest

WORKDIR /app
RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*

# Copy the correct build output (adjust based on find output)
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/bun.lockb /app/bun.lockb

COPY --from=builder /app/tsconfig.json ./tsconfig.json
# COPY --from=builder /app/start.js ./start.js

# Ensure dependencies are installed in the production container
RUN bun install --production
EXPOSE 3000
# CMD ["bun", "dist/main.js"]  # Changed from dist/src/main.js

# Run the application
CMD ["bun", "dist/src/main.js"]
# CMD ["bun", "start.js"]
