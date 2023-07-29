// Transform the data
export const transformData = (data = {}) => {
  return data.hasOwnProperty("date")
    ? {
        ...data,
        date: new Date(data.date).toISOString(),
        createdAt: new Date(data.createdAt).toISOString(),
        updatedAt: new Date(data.updatedAt).toISOString(),
      }
    : {
        ...data,
        createdAt: new Date(data.createdAt).toISOString(),
        updatedAt: new Date(data.updatedAt).toISOString(),
      };
};
