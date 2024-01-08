import CryptoJS from "crypto-js";
const CryptoSecurityKey = "@RICONDO#$-2024";

const encryption = (content) => {
  return CryptoJS.AES.encrypt(content, CryptoSecurityKey).toString();
};

const decryption = (cipherText) => {
  let bytes = CryptoJS.AES.decrypt(cipherText, CryptoSecurityKey);
  let result = bytes.toString(CryptoJS.enc.Utf8);
  return result.toString();
};

export const cryptoJS = {
  encryption,
  decryption,
};