//Pulling router tool from express, allows authorization routes to stay directly in auth.ts router
//Makes sure every endpoint ins't just put in server.ts
import { Router } from "express";

//This imports the prisma object in prisma.ts into this file. The object allows for auth.ts to talk to the database
//and run queries like find a user or create a user
import { prisma } from "../db/prisma";

//Creates new router instance and exports it so the main server can mount it.
export const authRouter = Router();

//Creates a route handler for HTTP POST requests at /register on this router
//Because the path is mount under /auth the full path becomes /auth/register
//async is used because await is going to be used for database operations
//await only works inside async functions
//req is incoming request, res is how a reponse is sent back. Thier postion placements are important
authRouter.post("/register", async (req, res ) => {
    //This pulls email and passowrd out of the request body. req.body is the JSON the client sends
    const { email, password } = req.body;
    //This validates input and makes sure the password and email actually exists
    //It also makes sure the values sent are of the current data type, instead of letting the whole code crash
    //Because of bad data input
    if (typeof email !== "string"  || typeof password !== "string"){
        //Sends an error response back to the client. 400 means bad request, which is the correct response to send back when dealing with bad user input.
        //return keyword is important because it stops the function right there and doesn't contniue with the rest of the regiester logic.
        return res.status(400).json({ error: "email and password are required in proper format" });
    }

    //This asks the database: Is there already a user with this email?
    //prisma.user refers to the User model coded in Prisma Schema. Find unique is used because email is unique in the schema user model
    //so at most only one user can match with another
    //The await keyword, pauses the function until the database returns the result and then stores it in exisiting
    const existing = await prisma.user.findUnique({ where: { email } });

    //This checks if database returned a user that has the same email as the one the client just newly requested for use
    //If exsiting is not null, the email with a user already exists
    if (existing){
        //This returns a 409 conflict, which is the status code used when the request conflicts with the current state of the server.
        //In this case client cannot create a new user because the email is already taken.
        //The return keyword again stops the function from contuniue the rest of the logic in the function, which would create a duplicate user.
        return res.status(409).json({ error: "Email already in use, Try A Different One"});
    }

    //Creates a new row in the User table blueprinted in Prisma Schema for each user request
    //prisma.user.create is Prisma's insert operation for the User Model. Meaning each row in the table is a user and thier data
    //await means the code pauses until the database finishes creating the user and returns the created record
    const user = await prisma.user.create({
        //This is the actual data being inserted into the database
        //Prisma will create a new user with the email and password values pulled from req.body
        //Password is being stored as plain text but will change as project evolves
        data: { email, password },
        //Controls what fields Prisma sends back after creating a user
        //You do not want the password to be apart of the these fields as its a security risk
        //When sending back an API reponse.
        select: { id: true, email: true, createdAt: true }
    });

    //This sends a response back to the client. The 201 HTTP status code means created. 
    //201 is the correct status code to send when your server sucessfully creates a new resource.
    //.json(user) returns the object selected so the client see something like (below)
    // {id, email, createdAt}
    //The return also stops the function so that nothing else runs afterwards.
    return res.status(201).json(user);
});