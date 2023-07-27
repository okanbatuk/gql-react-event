const inputs = `
input AddEventInput {
  title: String!
  description: String!
  price: Float!
  date: String!
  creator: ID!
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
}`;

export default inputs;
