import http from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import app from "./configs/express.js";
import { typeDefs, resolvers } from "./configs/schema.js";
import handler, { converter, notFound } from "./api/middlewares/errors.js";

const PORT = process.env.PORT || 4000;
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

try {
  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.use(notFound);
  app.use(converter);
  app.use(handler);

  await new Promise((resolve, reject) => {
    httpServer.listen({ port: PORT }, resolve, (err) => {
      if (err) return reject(err);
      console.log(`🚀 Server ready at http://localhost:${PORT}/`);
    });
  });
} catch (err) {
  console.error(err);
}
