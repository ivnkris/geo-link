const getFromLocalStorage = (key, defaultValue) => {
  const localStorageData = JSON.parse(localStorage.getItem(key));

  if (localStorageData === null) {
    return defaultValue;
  } else {
    return localStorageData;
  }
};

const getValueFromNestedObject = (
  nestedObj = {},
  tree = [],
  defaultValue = ""
) =>
  Array.isArray(tree)
    ? tree.reduce(
        (obj, key) => (obj && obj[key] ? obj[key] : defaultValue),
        nestedObj
      )
    : {};

// fetch data from 3rd party API
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.meta.code !== 200) {
      throw new Error("Oops something went wrong!");
    } else {
      return data;
    }
  } catch (error) {
    errorHandling();
  }
};
