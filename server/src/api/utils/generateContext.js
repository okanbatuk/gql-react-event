export default async (req) => {
  try {
    let email = "";
    const token = req.headers?.authorization?.split(" ")[1];

    // Validate token if token, otherwise continue
    if (token) {
      const { default: verifyToken } = await import(
        "../middlewares/verifyAuth.js"
      );
      // Verify the token
      email = await verifyToken(token);
    }
    return { email };
  } catch (err) {
    const { GraphQLError } = await import("graphql");
    throw new GraphQLError(err.message, {
      extensions: { code: err.code, http: { status: err.status } },
    });
  }
};
