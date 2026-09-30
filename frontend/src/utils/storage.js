export const localStorageSetItem = (key,data) => {
    localStorage.setItem(key,data)
}

export const localStorageGetItem = (key) => {
    return localStorage.getItem(key);
}