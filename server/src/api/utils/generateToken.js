import jwt from "jsonwebtoken";
/*
 * Generate Access Token
 *
 * @private
 * */
export default (user) => {
  return new Promise(async (resolve) => {
    const { tokenSecret } = await import("../../configs/vars.js");
    const newAccessToken = jwt.sign(user, tokenSecret, {
      expiresIn: "10m",
    });

    resolve(newAccessToken);
  });
};
