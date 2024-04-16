import Constants from "expo-constants";

const ipRegex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/;
const match = Constants.linkingUri.match(ipRegex);
// this is technically not a function, it's just a constant, but I still put it in this folder as it was fitting
export const IP_ADDRESS = match ? match[0] : null;
