import axios from "axios";
import { AuthService } from "./authService";

// Add a request interceptor to add a bearer token to all requests
axios.interceptors.request.use(
  async (config) => {
    debugger;
    const token = await AuthService.GetToken('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Add a response interceptor to handle errors globally
axios.interceptors.response.use(response => {
    return response;
}, (error) => {
  debugger;
    if (error?.response?.status === 401) {
      window.location.href = "/token-expired?message=Your session has been expired. Please sign in to continue&signIn=true";
    } else return Promise.reject(error);
});



const get = (url) => {
    return axios.get(url);
}

const post = (url, data) => {
    return axios.post(url, data);
}

const put = (url, data) => {
    return axios.put(url, data);
}


export const HttpServices = {
    Post: post,
    Get: get,
    Put: put
}