# Use the Bun image
FROM oven/bun:alpine

# Set the working directory inside the container
WORKDIR /app/next-app

# Copy package.json, bun.lockb, and other necessary files
COPY package.json bun.lockb ./

# Install dependencies using Bun
RUN bun install

# RUN bunx prisma migrate dev

RUN bunx prisma generate dev 

# Copy the rest of the app’s source code, including the src directory
COPY . .

# For disabling Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1


# Expose the port your app will run on
EXPOSE 3000

# Start the Next.js app in development mode
CMD bun run dev 
