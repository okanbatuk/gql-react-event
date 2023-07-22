import {
  createEvent,
  getEvents,
} from "../api/controllers/events.controller.js";

export const typeDefs = `#graphql
  type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!    
  }
  type Query {
    hello: String
    events: [Event]
  }

  type Mutation {
    addEvent(event: AddEventInput!): Event
  }

  input AddEventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
  }
`;

export const resolvers = {
  Query: {
    hello: () => "Hello World!",
    events: () => getEvents(),
  },

  Mutation: {
    addEvent: async (_, args) => {
      let event = await createEvent(args.event);
      return event;
    },
  },
};
