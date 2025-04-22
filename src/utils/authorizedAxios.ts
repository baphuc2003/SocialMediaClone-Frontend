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
    "https://socialmediaclone-backend-1.onrender.com/api/user/refresh-token"
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
      // Kiểm tra nguyên nhân lỗi 401
      const errorMessage = error.response?.data?.message || "";
      localStorage.removeItem("userInfo");
      await authorizedAxiosInstance.delete(
        "https://socialmediaclone-backend-1.onrender.com/api/user/logout"
      );
      if (
        errorMessage.includes("Unauthenticated user") ||
        errorMessage.includes("user not verified")
      ) {
        toast.error("Vui lòng xác thực email để tiếp tục.", {
          autoClose: 2000,
        });
      } else {
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.", {
          autoClose: 2000,
        });
      }
      setTimeout(() => {
        location.href = "/login";
      }, 2000);
      // Unauthenticated user
      return Promise.reject(error);
      // return (location.href = "/");
    }

    const originalRequest = error.config;

    if (error.response?.status === 410 && !originalRequest._retry) {
      console.log("ma loi 410");
      originalRequest._retry = true;

      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .catch(async (err) => {
            console.log("check refresh token error: ", err);
            await authorizedAxiosInstance.delete(
              "https://socialmediaclone-backend-1.onrender.com/api/user/logout"
            );
            toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.", {
              autoClose: 2000,
            });
            setTimeout(() => {
              location.href = "/login";
            }, 2000);
            return Promise.reject(err);
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }
      return refreshTokenPromise.then(() => {
        return authorizedAxiosInstance(originalRequest);
      });
    }
    if (error.response?.status !== 410) {
      toast.error(
        error.response?.data?.message || error?.message || "Có lỗi xảy ra"
      );
    }

    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
