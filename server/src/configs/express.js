import express, { json } from "express";
import cors from "cors";
import connectDb from "./dbConn.js";

/*
 * Create app
 * @public
 */
const app = express();

// Enable Cross Origin Resource Sharing
app.use(cors());

// Connect to mongo
connectDb();

// Parse requests with JSON
app.use(json());

export default app;
