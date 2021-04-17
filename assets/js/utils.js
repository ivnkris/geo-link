const getFromLocalStorage = (key, defaultValue) => {
  const localStorageData = JSON.parse(localStorage.getItem(key));

  if (localStorageData === null) {
    return defaultValue;
  } else {
    return localStorageData;
  }
};
