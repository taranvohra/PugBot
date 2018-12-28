export const createSortedArrayFromObject = (obj, sortBy) => {
  return Object.keys(obj)
    .reduce((acc, curr) => {
      acc.push({ id: curr, ...obj[curr] });
      return acc;
    }, [])
    .sort((a, b) => a[sortBy] - b[sortBy]);
};

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
