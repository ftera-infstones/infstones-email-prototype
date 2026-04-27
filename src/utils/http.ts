import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

const instance = axios.create({
  timeout: 30000,
});

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: { response: AxiosResponse }) => Promise.resolve(error.response)
);

const Get = <T>(url: string, config?: AxiosRequestConfig) =>
  instance.get<T>(url, config);

const Post = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  instance.post<T>(url, data, config);

const Put = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  instance.put<T>(url, data, config);

const Delete = <T>(url: string, config?: AxiosRequestConfig) =>
  instance.delete<T>(url, config);

const Patch = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  instance.patch<T>(url, data, config);

export { Get, Post, Put, Delete, Patch };
