export const createSortedArrayFromObject = (obj, sortBy) => {
  return Object.keys(obj)
    .reduce((acc, curr) => {
      acc.push({ id: curr, ...obj[curr] });
      return acc;
    }, [])
    .sort((a, b) => a[sortBy] - b[sortBy]);
};
