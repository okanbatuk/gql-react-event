import http from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import mongoose from "mongoose";
import app from "./configs/express.js";
import { typeDefs, resolvers } from "./configs/schema.js";
import * as error from "./api/middlewares/errors.js";
import { port } from "./configs/vars.js";

const PORT = port || 4000;
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// If an error occur, this'll be triggered
mongoose.connection.on(
  "error",
  console.error.bind(console, "Connection Error:")
);

// If you disconnect db this event will be triggered
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});

// Open the connection
mongoose.connection.once("open", async () => {
  console.log("Connected to MongoDB");
  try {
    // Starting server after the mongodb connection
    await server.start();

    //
    app.use("/graphql", expressMiddleware(server));

    /*
     * Error Handling
     *
     * */
    app.use(error.notFound);
    app.use(error.converter);

    // Listening to the PORT
    await new Promise((resolve, reject) => {
      httpServer.listen({ port: PORT }, resolve, (err) => {
        if (err) return reject(err);
        console.log(`🚀 Server ready at http://localhost:${PORT}/`);
      });
    });
  } catch (err) {
    console.error(err);
  }
});
