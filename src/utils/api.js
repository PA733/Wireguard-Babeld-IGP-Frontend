import axios from "axios";
import router from "../router";

// 创建 axios 实例
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 10000, // 请求超时时间
});

// 设置请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从 localStorage 中获取 token
    const token = localStorage.getItem("jwt_token");

    if (token) {
      // 如果存在 token，添加 Authorization 头部
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 设置响应拦截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      // 处理未授权的请求，比如跳转到登录页面
      console.log("Token expired or invalid. Please log in again.");
      // 可以在这里清除 localStorage 中的 token 或重定向到登录页
      localStorage.removeItem("jwt_token");
      // 使用导入的 router 实例，而不是 this.router
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export default api;
