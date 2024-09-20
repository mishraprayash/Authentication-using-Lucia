import { PrismaClient } from "@prisma/client";

// creating a new instance of PrismaClient with log level set to error and warn in development mode
const client = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

// making a global variable for prisma client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// exporting prisma client
export const prisma = globalForPrisma.prisma ?? client;

// this is for development purposes only to ensure that we dont create multiple instances of PrismaClient
if (process.env.NODE_ENV === "development") {
  globalForPrisma.prisma = client;
}
