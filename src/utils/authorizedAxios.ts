/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { toast } from "react-toastify";

const authorizedAxiosInstance: axios.AxiosInstance = axios.create();

authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10;

authorizedAxiosInstance.defaults.withCredentials = true;

// Add a request interceptor
authorizedAxiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

let refreshTokenPromise: Promise<axios.AxiosResponse<any, any>> | null = null;

const refreshTokenAPI = async () => {
  return await authorizedAxiosInstance.post(
    "http://localhost:3000/api/user/refresh-token"
  );
};

// Add a response interceptor
authorizedAxiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function (error) {
    console.log("check 41 ", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("userInfo");
      await authorizedAxiosInstance.delete(
        "http://localhost:3000/api/user/logout"
      );
      // return (location.href = "/");
    }

    const originalRequest = error.config;

    if (error.response?.status === 410 && !originalRequest._retry) {
      console.log("ma loi 410");
      originalRequest._retry = true;

      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .catch(async (err) => {
            console.log("chekc 58 ", err);
            await authorizedAxiosInstance.delete(
              "http://localhost:3000/api/user/logout"
            );

            // location.href = "/login";
            return Promise.reject(err);
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }
    }

    if (error.response?.status !== 410) {
      toast.error(
        error.response?.data?.message || error?.message || "Có lỗi xảy ra"
      );
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
