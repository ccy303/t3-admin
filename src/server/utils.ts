export const formatQueryWhere = (query: { [key: string]: any }) => {
  console.log(query);
  const res: { [key: string]: any } = {};
  for (let key in query) {
    const item = query[key];
    if (item.operator === "equals") {
      res[key] = {
        equals: item.value,
      };
    }

    if (item.operator === "like") {
      res[key] = {
        databases: item.value,
      };
    }
  }

  return res;
};
