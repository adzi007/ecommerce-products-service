# Dockerfile
# Use Bun for building the application
FROM oven/bun:latest as builder

WORKDIR /app

# Copy package files
COPY bun.lockb package.json ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the source code
COPY . .

# Build the application
RUN bun run build

# Start production image
FROM oven/bun:latest

WORKDIR /app

# Copy only the necessary files from the builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lockb ./bun.lockb

# Ensure dependencies are installed in the production container
RUN bun install --production

EXPOSE 3000

# Run the application
CMD ["bun", "dist/src/main.js"]
