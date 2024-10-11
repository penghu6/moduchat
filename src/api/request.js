import axios from "axios";

const service = axios.create({
  baseURL: 'http://openai-proxy.brain.loocaa.com',
  timeout: 100000,
});

// 请求拦截
service.interceptors.request.use(
  (config) => {
    const token = 'DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK'; // localStorage.getItem("userToken");
    if (token) {
      config.headers['Authorization'] = "Bearer " + token;
    }
    return config;
  },
  (err) => {
    console.log("请求拦截出错，错误信息：", err);
  }
);

// 响应拦截
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    return res;
  },
  (err) => {
    console.log("响应拦截出错，错误信息：", err);
  }
);

export default service;
