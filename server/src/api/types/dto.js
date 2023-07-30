const dtos = `
  type LoginUser {
    _id: ID!
    email: String!
    accessToken: String!
    createdAt: String!
    updatedAt: String!
  }

  type RegUser {
    _id: ID!
    email: String!
    createdAt: String!
    updatedAt: String!
  }`;
export default dtos;
