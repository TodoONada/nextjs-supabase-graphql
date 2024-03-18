export const getAgeGroup = (birthday: any) => {
  const age = Math.floor(
    (new Date().getTime() - new Date(birthday).getTime()) / 3.15576e10
  );
  return Math.floor(age / 10) * 10;
};

export const sortDataMap = (dataMap: Map<number, number>) => {
  return new Map(
    Array.from(dataMap).sort((a, b) => {
      if (a[0] > b[0]) {
        return 1;
      } else if (a[0] < b[0]) {
        return -1;
      }
      return 0;
    })
  );
};

export const initAgeDataMap = () => {
  const map = new Map<number, number>();
  map.set(10, 0);
  map.set(20, 0);
  map.set(30, 0);
  map.set(40, 0);
  map.set(50, 0);
  return map;
};

export const initMaleOrFemaleMap = () => {
  const map = new Map<String, number>();
  map.set("りんご", 0);
  map.set("みかん", 0);
  map.set("バナナ", 0);
  return map;
};
