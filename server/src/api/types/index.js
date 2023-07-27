import entities from "./entities.js";
import queries from "./queries.js";
import mutations from "./mutations.js";
import inputs from "./inputs.js";

const schema = `${entities} ${queries} ${mutations} ${inputs}`;

export default schema;
