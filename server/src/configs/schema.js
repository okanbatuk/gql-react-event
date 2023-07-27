import { buildSchema } from "graphql";
import * as controllers from "../api/controllers/index.js";
import schema from "../api/types/index.js";

export const typeDefs = buildSchema(schema);

export const resolvers = {
  Query: {
    hello: () => "Hello World!",
    ...controllers.eventsController.queries,
    ...controllers.usersController.queries,
  },

  // Relations
  ...controllers.eventsController.relations,
  ...controllers.usersController.relations,

  Mutation: {
    // Mutations of Events
    ...controllers.eventsController.mutations,

    // Mutations of Auth
    ...controllers.authController.mutations,
  },
};
