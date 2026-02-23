import "dotenv/config";
//(For the first line code: loads .env file into process.env immediately when the server starts)
//(For the first line: This must be before any prisma import so the DB URL exists first)

//This imports the express library to the file
import express from "express";
//imports router built in /auth/register so the main server can attach it
import { authRouter } from "./routes/auth";

//Creating an instance of Express
const app = express();
//Adds middleware that parses requests that are JSON
app.use(express.json());

//Mounts router under /auth. So the path route becomes: (below)
// /auth + /register = POST /auth/register
app.use("/auth", authRouter);

//Defining the route - The two objects poistions are important  
app.get("/health", (_req, res) => {
//Setting the HTTP status to Success and Sending a JSON back to the Client
res.status(200).json( { status: "ok"});
});

//Deciding what port the server should be in
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

//Starts the server and tells it to listen for requests on that PORT
app.listen(PORT, () => {
console.log(`Backend running on http://localhost:${PORT}`);
});

