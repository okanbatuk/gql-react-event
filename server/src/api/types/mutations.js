const mutations = `
type Mutation {
  # Type of Event Mutations
  addEvent(event: AddEventInput!): Event!
  updateEvent(_id: ID!, edits: UpdateEventInput!):  Event!
  deleteEvent(_id: ID!): [Event]

  # Type of Auth Mutations
  register(user: AuthInput!): User!
  login(user: AuthInput!): User!

  # Type of Booking Mutations
  bookEvent(event: ID!,user: ID!): Booking!
}`;

export default mutations;
