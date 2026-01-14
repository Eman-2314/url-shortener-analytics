//This imports the express library to the file
import express from "express";
//Creating an instance of Express
const app = express();
//Adds middle ware that parses requests that are JSON
app.use(express.json());

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

