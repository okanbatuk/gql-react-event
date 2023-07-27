const queries = `
type Query {
  hello: String

  events: [Event]
  event: Event

  users: [User]
  user(_id: ID!): User
}`;

export default queries;
