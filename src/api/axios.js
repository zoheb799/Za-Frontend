import axios from "axios";

console.log("AXIOS BASE URL =>", import.meta.env.VITE_API_BASE_URL);

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export default instance;