import path from "path";
import { config } from "dotenv-safe";

let env = "",
  port = "",
  db = "",
  tokenSecret = "";

config({
  allowEmptyValues: true,
  path: path.join(path.resolve() + "/.env"),
});

(async () => {
  env = process.env.NODE_ENV;
  port = process.env.PORT;
  db = process.env.MONGO;
  tokenSecret = process.env.ACCESS_TOKEN_SECRET;
})();

export { env, port, db, tokenSecret };
