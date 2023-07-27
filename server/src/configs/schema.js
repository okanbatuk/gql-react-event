import {
  eventsController,
  authController,
  usersController,
} from "../api/controllers/index.js";

export const typeDefs = `#graphql
  type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    user_id: ID!
  }

  type User {
    _id: ID!
    email: String!
    password: String
    createdEvents: [ID!]
  }

  type Query {
    hello: String
    events: [Event]
    users: [User]
    user(_id: ID!): User
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
    user_id: ID!
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
    ...usersController.queries,
  },

  Mutation: {
    // Mutations of Events
    ...eventsController.mutations,

    // Mutations of Auth
    ...authController.mutations,
  },
};
