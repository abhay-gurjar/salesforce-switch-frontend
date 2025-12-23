import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

export const login = () => {
  window.location.href = `${BASE_URL}/login`;
};

export const logout = () => {
  window.location.href = `${BASE_URL}/logout`;
};

export const getValidationRules = () => {
  return axios.get(`${BASE_URL}/validation-rules`);
};

export const deployChanges = (rules) => {
  return axios.post(`${BASE_URL}/deploy`, { rules });
};
