import { GraphQLError } from "graphql";
import { eventsService, authService } from "../api/services/index.js";

const MAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{6,24}$/;

const validation = (user) => {
  return new Promise((resolve) => {
    resolve(MAIL_REGEX.test(user.email) && PWD_REGEX.test(user.password));
  });
};

export const typeDefs = `#graphql
  type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!    
  }

  type User {
    _id: ID!
    email: String!
    password: String
  }

  type Query {
    hello: String
    events: [Event]
  }

  type Mutation {
    # Type of Event Mutations
    addEvent(event: AddEventInput!): Event
    updateEvent(_id: ID!, edits: UpdateEventInput!): Event
    deleteEvent(_id: ID!): [Event]

    # Type of Auth Mutations
    register(user: AuthInput!): User
    login(user: AuthInput!): User
  }

  input AddEventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
  }

  input UpdateEventInput {
    title: String
    description: String
    price: Float
    date: String
  }

  input AuthInput {
    email: String!
    password: String!
  }
`;

export const resolvers = {
  Query: {
    hello: () => "Hello World!",
    events: () => eventsService.getEvents(),
  },

  Mutation: {
    /*
     * Mutations of Events (CRUD)
     *
     * */
    addEvent: async (_, args) => {
      let event = await eventsService.createEvent(args.event);
      return event;
    },
    updateEvent: async (_, args) => {
      let updatedEvent = await eventsService.updateEvent(args._id, args.edits);
      return updatedEvent;
    },
    deleteEvent: async (_, args) => {
      let events = await eventsService.deleteEvent(args._id);
      return events;
    },

    /*
     * Mutations of Auth
     */
    register: async (_, args) => {
      const { user } = args;
      const validate = await validation(user);

      if (!validate)
        throw new GraphQLError("ValidationError", {
          extensions: { code: "VALIDATION_ERROR" },
        });
      let newUser = await authService.register(user);
      newUser.password = null;
      return newUser;
    },

    login: async (_, args) => {
      const { user } = args;
      const validate = await validation(user);
      if (!validate)
        throw new GraphQLError("ValidationError", {
          extensions: { code: "VALIDATION_ERROR" },
        });

      let result = await authService.login(user);
      newUser.password = null;
      return result;
    },
  },
};
