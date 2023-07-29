import convertDate from "./convertDate.js";

// Transform the data
export default (data = {}) => {
  return data.hasOwnProperty("date")
    ? {
        ...data,
        date: convertDate(data.date),
        createdAt: convertDate(data.createdAt),
        updatedAt: convertDate(data.updatedAt),
      }
    : {
        ...data,
        createdAt: convertDate(data.createdAt),
        updatedAt: convertDate(data.updatedAt),
      };
};
