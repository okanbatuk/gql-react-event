import _ from "lodash";
export default (field = "", entity = "") => {
  return new Promise(async (resolve, reject) => {
    !_.isEmpty(field)
      ? resolve(true)
      : reject({
          message: `${entity} Not Found`,
          code: "NOT_FOUND",
          status: 404,
        });
  });
};
