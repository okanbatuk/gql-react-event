import entities from "./entities.js";
import queries from "./queries.js";
import mutations from "./mutations.js";
import inputs from "./inputs.js";
import dtos from "./dto.js";

const schema = `${entities} ${dtos} ${queries} ${mutations} ${inputs}`;

export default schema;
