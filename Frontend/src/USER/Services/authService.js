import api from "./api";

export const signupUser = async (userData) => {
  const response = await api.post("/user/signup", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post("/user/login", userData);
  return response.data;
};