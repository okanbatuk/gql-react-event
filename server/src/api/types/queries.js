const queries = `
type Query {
  hello: String

  events: [Event!]!
  event(_id: ID!): Event!

  users: [User!]!
  user(_id: ID!): User!

  bookings: [Booking!]!
}`;

export default queries;
