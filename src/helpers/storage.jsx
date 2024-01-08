import { cryptoJS } from "./crypto";

const Required_CryptoSecurity = true;

const getItemFromStorage = (item, storageType) => {
  let cipherText = "";
  if(storageType === "local") cipherText =  window.localStorage.getItem(item);
  else cipherText =  window.sessionStorage.getItem(item);

  let returnValue = "";
  if (Required_CryptoSecurity && cipherText)
    returnValue = cryptoJS.decryption(cipherText);
  else returnValue = cipherText;

  return returnValue;
};

const removeFromStorage = (item, storageType) => {
  if(storageType === "local")
    window.localStorage.removeItem(item);
  else
    window.sessionStorage.removeItem(item);
};

const setItemToStorage = (item, content, storageType) => {
  debugger;
  let _content = Required_CryptoSecurity
    ? cryptoJS.encryption(content)
    : content;
  if(storageType === "local")  
      window.localStorage.setItem(item, _content);
  else     
     window.sessionStorage.setItem(item, _content);
  
  return true;
};


const setItemToLocalStorage = (item, content) => setItemToStorage(item, content, "local");
const getItemFromLocalStorage = (item) =>  getItemFromStorage(item, "local");
const removeFromLocalStorage = (item) =>  removeFromStorage(item, "local");
const removeAllFromLocalStorage = (item) =>  { window.localStorage.clear(); }

const setItemToSessionStorage = (item, content) => setItemToStorage(item, content, "session");
const getItemFromSessionStorage = (item) =>  getItemFromStorage(item, "session");
const removeFromSessionStorage = (item) =>  removeFromStorage(item, "session");
const removeAllFromSessionStorage = (item) =>  { window.sessionStorage.clear(); }

export const LocalStorage = {
  setItem: setItemToLocalStorage,
  getItem: getItemFromLocalStorage,
  removeItem: removeFromLocalStorage,
  removeAll: removeAllFromLocalStorage,
};

export const SessionStorage = {
  setItem: setItemToSessionStorage,
  getItem: getItemFromSessionStorage,
  removeItem: removeFromSessionStorage,
  removeAll: removeAllFromSessionStorage,
};