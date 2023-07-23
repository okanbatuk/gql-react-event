import * as eventsService from "../api/services/events.service.js";

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
    updateEvent(_id: ID!, edits: UpdateEventInput!): Event
    deleteEvent(_id: ID!): [Event]
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
`;

export const resolvers = {
  Query: {
    hello: () => "Hello World!",
    events: () => eventsService.getEvents(),
  },

  Mutation: {
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
  },
};
