// function to get array from local storage and if empty return default value
const getFromLocalStorage = (key, defaultValue) => {
  const localStorageData = JSON.parse(localStorage.getItem(key));

  if (localStorageData === null) {
    return defaultValue;
  } else {
    return localStorageData;
  }
};

// function to get value from nested object using elements of string given as an argument and return default value if not found
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
