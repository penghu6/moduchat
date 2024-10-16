import axios from "axios";

// 创建 OpenAI 服务实例
const openaiService = axios.create({
  baseURL: 'http://openai-proxy.brain.loocaa.com',
  timeout: 100000,
});

// 创建后台接口服务实例
const backendService = axios.create({
  baseURL: '127.0.0.1:8080', // 替换为您的后台接口地址
  timeout: 100000,
});

// 配置请求和响应拦截器
function setupInterceptors(service) {
  service.interceptors.request.use(
    (config) => {
      const token = 'DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK'; // 从存储或其他方式获取
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
      }
      return config;
    },
    (error) => {
      console.error('请求拦截出错：', error);
      return Promise.reject(error);
    }
  );

  service.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      console.error('响应拦截出错：', error);
      return Promise.reject(error);
    }
  );
}

// 应用拦截器
setupInterceptors(openaiService);
setupInterceptors(backendService);

export { openaiService, backendService };
