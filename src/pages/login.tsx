import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authorizedAxiosInstance from "../utils/authorizedAxios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LoginPageProps {
  onClose: () => void;
}

export function LoginPage({ onClose }: LoginPageProps) {
  const navigate = useNavigate();
  const [isModalOpen] = useState(true);
  const [dataLogin, setDataLogin] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { email, password } = dataLogin;

    const userData = {
      user: {
        email: email,
        password: password,
      },
    };
    const response = await authorizedAxiosInstance.post(
      "https://socialmediaclone-backend-1.onrender.com/api/user/login",
      userData
    );
    console.log("check 27 ", response);

    if (response.status === 200 || response.status === 201) {
      sessionStorage.setItem("userInfo", response.data.data?.userId);
      sessionStorage.setItem("userName", response.data.data?.username);
      navigate("/home");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataLogin((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-[#5b708366] bg-opacity-50 flex items-center justify-center ">
            <div className="bg-black_#000000 p-6  shadow-lg w-96 rounded-2xl">
              <div className="flex justify-center">
                <div className="btn_exit basis-[50%]">
                  <button onClick={onClose} className="text-[#f0f8ff]">
                    X
                  </button>
                </div>
                <div className="">
                  <img
                    src="https://social-network-clone.s3.ap-southeast-1.amazonaws.com/logoSocial.jpeg"
                    alt="Logo"
                    className="h-12 mx-auto rounded-full "
                  />
                </div>
                <div className="basis-[50%]"></div>
              </div>

              <h2 className="font-bold mb-4 mt-4 text-center text-3xl text-white_#f0f8ff">
                Đăng nhập
              </h2>

              <form className="mb-5">
                <label className="block mb-3">
                  <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-white_#f0f8ff">
                    Email
                  </span>
                  <input
                    value={dataLogin.email}
                    onChange={handleChange}
                    type="email"
                    name="email"
                    className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                    placeholder="you@example.com"
                  />
                </label>

                <label className="block mb-8">
                  <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-white_#f0f8ff">
                    Mật khẩu
                  </span>
                  <input
                    value={dataLogin.password}
                    onChange={handleChange}
                    type="password"
                    name="password"
                    className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                    placeholder=""
                  />
                </label>
                <button
                  disabled={isLoading}
                  onClick={handleLogin}
                  className="bg-blue-500 text-white px-4 py-2 rounded-3xl w-full hover:bg-red-400 transition-colors duration-300"
                >
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </form>

              <div className="flex justify-between">
                <a href="#">
                  <span className="text-[#1d9bf0]">Quên mật khẩu</span>
                </a>

                <a href="#">
                  <span className="text-[#1d9bf0]">Đăng ký</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
}
