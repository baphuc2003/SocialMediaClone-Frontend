/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authorizedAxiosInstance from "../utils/authorizedAxios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface RegisterPageProps {
  onClose: () => void;
}

export function RegisterPage({ onClose }: RegisterPageProps) {
  const navigate = useNavigate();
  const [isModalOpen] = useState(true);
  const [dataRegis, setDataRegis] = useState({
    email: "",
    username: "",
    password: "",
    gender: "",
  });
  console.log("check 22 ", dataRegis);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cấu hình API endpoint cho local và production
  const API_BASE_URL = "https://socialmediaclone-backend-1.onrender.com";
  // process.env.NODE_ENV === "production"
  //   ? "https://socialmediaclone-backend-1.onrender.com"
  //   : "http://localhost:3000";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, username, password, gender } = dataRegis;

    // Validation cơ bản
    if (!email || !username || !password || !gender) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    const userData = {
      user: {
        email,
        username,
        password,
        gender,
      },
    };

    setIsSubmitting(true);
    try {
      const response = await authorizedAxiosInstance.post(
        `${API_BASE_URL}/api/user/register`,
        userData
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(
          "Đăng ký thành công! Vui lòng kiểm tra Gmail để xác thực tài khoản.",
          {
            autoClose: 2000, // Tự động đóng sau 2 giây
          }
        );
        // Trì hoãn navigate và onClose để chờ toast hiển thị xong
        setTimeout(() => {
          console.log("Navigating to /login");
          onClose(); // Đóng modal
          navigate("/login", { replace: true }); // Chuyển hướng về trang đăng nhập
        }, 2000); // Đồng bộ với autoClose
      } else {
        toast.error("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDataRegis((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-[#5b708366] bg-opacity-50 flex items-center justify-center">
            <div className="bg-black_#000000 p-6 shadow-lg w-96 rounded-2xl">
              <div className="flex justify-center">
                <div className="btn_exit basis-[50%]">
                  <button onClick={onClose} className="text-[#f0f8ff]">
                    X
                  </button>
                </div>
                <div>
                  <img
                    src="https://social-network-clone.s3.ap-southeast-1.amazonaws.com/logoSocial.jpeg"
                    alt="Logo"
                    className="h-12 mx-auto rounded-full"
                  />
                </div>
                <div className="basis-[50%]"></div>
              </div>

              <h2 className="font-bold mb-4 mt-4 text-center text-3xl text-white_#f0f8ff">
                Đăng ký
              </h2>

              <form className="mb-5" onSubmit={handleRegister}>
                <label className="block mb-3">
                  <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-white_#f0f8ff">
                    Email
                  </span>
                  <input
                    value={dataRegis.email}
                    onChange={handleChange}
                    type="email"
                    name="email"
                    className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                    placeholder="you@example.com"
                    required
                  />
                </label>

                <label className="block mb-3">
                  <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-white_#f0f8ff">
                    Username
                  </span>
                  <input
                    value={dataRegis.username}
                    onChange={handleChange}
                    type="text"
                    name="username"
                    className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                    required
                  />
                </label>

                <label className="block mb-3">
                  <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-white_#f0f8ff">
                    Mật khẩu
                  </span>
                  <input
                    value={dataRegis.password}
                    onChange={handleChange}
                    type="password"
                    name="password"
                    className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                </label>

                <label className="block mb-8">
                  <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-white_#f0f8ff">
                    Giới tính
                  </span>
                  <select
                    value={dataRegis.gender}
                    onChange={handleChange}
                    name="gender"
                    className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                    required
                  >
                    <option value="" disabled>
                      Chọn giới tính
                    </option>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                  </select>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-blue-500 text-white px-4 py-2 rounded-3xl w-full hover:bg-red-400 transition-colors duration-300 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
                </button>
              </form>

              {/* <div className="flex justify-between">
                <a href="#">
                  <span className="text-[#1d9bf0]">Quên mật khẩu</span>
                </a>
                <a href="#">
                  <span className="text-[#1d9bf0]">Đăng nhập</span>
                </a>
              </div> */}
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
}
