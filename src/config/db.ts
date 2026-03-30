import { PrismaClient } from "@prisma/client";
import { MongoDBAdapter } from "@prisma/adapter-mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.DATABASE_URL!);
const adapter = new MongoDBAdapter(client);

const prisma = new PrismaClient({ adapter });

export default prisma;
