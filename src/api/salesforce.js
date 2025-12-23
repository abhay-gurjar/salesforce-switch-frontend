import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

export const login = () => {
  window.location.href = `${process.env.REACT_APP_API_URL}/login`;
};

export const me = () => {
  return api.get("/me");
};

export const getValidationRules = () => {
  return api.get("/validation-rules");
};

export const deployChanges = (rules) => {
  return api.post("/deploy", { rules });
};

export const logout = () => {
  return api.get("/logout");
};
