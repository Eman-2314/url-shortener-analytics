//Prisma Client is the class prisma genrates after migration
import { PrismaClient } from "@prisma/client";

import { Pool } from "pg";

import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl){
    throw new Error("DATABASE_URL is Missing. Check backend/.env and dotenv loading.");
}

const pool = new Pool ({ connectionString: databaseUrl });

const adapter = new PrismaPg(pool);

//( new PrismaCLient() )Opens a connection pool so that you can run queries
//Exporting it lets routes resuse the client instead of creating one for each request
export const prisma = new PrismaClient({ adapter }); 


