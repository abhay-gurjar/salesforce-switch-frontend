import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

export const login = () => {
  window.location.replace(`${BASE_URL}/api/login`);
};

export const getValidationRules = () => {
  return axios.get(`${BASE_URL}/api/rules`);
};

export const deployChanges = (rules) => {
  return axios.post(`${BASE_URL}/api/deploy`, { rules });
};

export const logout = async () => {
  await axios.get(`${BASE_URL}/api/logout`);
  window.location.replace("/");
};
