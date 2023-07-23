import { eventsController, authController } from "../api/controllers/index.js";

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
    ...eventsController.queries,
  },

  Mutation: {
    // Mutations of Events
    ...eventsController.mutations,

    // Mutations of Auth
    ...authController.mutations,
  },
};
