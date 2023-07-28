import { buildSchema } from "graphql";
import * as controllers from "../api/controllers/index.js";
import schema from "../api/types/index.js";

export const typeDefs = buildSchema(schema);

export const resolvers = {
  Query: {
    hello: () => "Hello World!",
    ...controllers.eventsController.queries,
    ...controllers.usersController.queries,
    ...controllers.bookingsController.queries,
  },

  // Relations
  User: {
    createdEvents: controllers.eventsController.relations.createdEvents,
  },

  Booking: {
    event: controllers.eventsController.relations.event,
    user: controllers.usersController.relations.user,
  },

  Event: {
    creator: controllers.usersController.relations.creator,
  },

  Mutation: {
    // Mutations of Events
    ...controllers.eventsController.mutations,

    // Mutations of Auth
    ...controllers.authController.mutations,

    // Mutations of Bookings
    ...controllers.bookingsController.mutations,
  },
};
