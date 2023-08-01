import jwt from "jsonwebtoken";

export default (token) => {
  return new Promise(async (resolve, reject) => {
    // Import the secret key
    const { tokenSecret } = await import("../../configs/vars.js");

    // Verify the token
    jwt.verify(token, tokenSecret, (err, decoded) => {
      // If there was an error eg token expired etc. Return error
      if (err)
        return reject({
          message: err.message,
          code: "UNAUTHORIZED",
          status: 401,
        });

      // Return the user who wants to login
      resolve(decoded.email);
    });
  });
};
