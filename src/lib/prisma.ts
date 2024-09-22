import { PrismaClient } from "@prisma/client";

// creating a new instance of PrismaClient with log level set to error and warn in development mode
const client = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

// making a global variable for prisma client
let prisma: PrismaClient;
// if the environment is development, attach the prisma client to the global object
if(process.env.NODE_ENV === "development"){
  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
  };
// if PrismaClient is already attached to the global object reuse it otherwise, attach the current client
  if(!globalForPrisma.prisma){
    globalForPrisma.prisma = client;
  }
  prisma = globalForPrisma.prisma;
}
else{
  prisma = client;
}

export { prisma };



