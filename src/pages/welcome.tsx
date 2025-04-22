/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { LoginPage } from "./login";
import { RegisterPage } from "./registration";

export function Welcome() {
  const [previousPath, setPreviousPath] = useState("/");
  const [isLoginFormVisible, setLoginFormVisible] = useState(false); // Quản lý trạng thái form đăng nhập
  const [isRegisterFormVisible, setRegisterFormVisible] = useState(false); // Quản lý trạng thái form đăng ký

  useEffect(() => {
    // Lưu lại đường dẫn trước khi vào trang login hoặc register
    setPreviousPath(window.location.pathname);
  }, []);

  const handleLoginClick = () => {
    setLoginFormVisible(true);
  };

  const handleRegisterClick = () => {
    setRegisterFormVisible(true);
  };

  // Hàm ẩn form đăng nhập
  const handleCloseLoginForm = () => {
    window.history.pushState(null, "", previousPath);
    setLoginFormVisible(false);
  };

  // Hàm ẩn form đăng ký
  const handleCloseRegisterForm = () => {
    window.history.pushState(null, "", previousPath);
    setRegisterFormVisible(false);
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          .animate-spin-slow {
            animation: spin 20s linear infinite;
          }
        `}
      </style>
      <div className="container bg-black_#000000 min-h-screen min-w-full flex">
        {/* Thẻ bên trái: Chiếm 40% */}
        <div className="l_container max-h-full flex-1 items-center justify-center basis-[40%] bg-black_#000000">
          <div className="h-full flex items-center">
            <img
              src="https://social-network-clone.s3.ap-southeast-1.amazonaws.com/logoSocial.jpeg"
              alt="Logo"
              className="h-52 mx-auto rounded-full animate-spin-slow"
            />
          </div>
        </div>

        {/* Thẻ bên phải: Chiếm 60% */}
        <div className="gr max-h-full flex-1 flex flex-col gap-5 r_container basis-[60%] bg-black_#000000">
          <div className="h-full flex flex-col gap-7 justify-center">
            <div>
              <span className="text-white_#f0f8ff text-7xl font-bold">
                Đang diễn ra ngay bây giờ
              </span>
            </div>

            <div>
              <span className="text-white_#f0f8ff text-3xl font-semibold">
                Tham gia ngay.
              </span>
            </div>

            <div className="btn w-full flex gap-4 flex-col">
              <div className="max-w-[380px]">
                <button
                  onClick={handleRegisterClick}
                  className="bg-[#1d9bf0] text-white_#f0f8ff w-full p-2 rounded-3xl hover:bg-[#F3453F] transition-colors duration-300"
                >
                  Tạo tài khoản
                </button>
              </div>

              <div className="max-w-[380px]">
                <div className="flex items-center">
                  <div className="h-[1px] w-4 bg-slate-400 basis-[40%]"></div>
                  <div className="text-white_#f0f8ff basis-[20%] text-center">
                    hoặc
                  </div>
                  <div className="h-[1px] w-4 bg-slate-400 basis-[40%]"></div>
                </div>
              </div>

              <div className="border-slate-400 max-w-[380px] border-[1px] rounded-3xl hover:bg-slate-200 transition-colors duration-300">
                <button
                  onClick={handleLoginClick}
                  className="border-slate-400 text-[#1d9bf0] w-full p-2"
                >
                  Đăng nhập
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hiển thị LoginPage khi isLoginFormVisible là true */}
      {isLoginFormVisible && <LoginPage onClose={handleCloseLoginForm} />}

      {/* Hiển thị RegisterPage khi isRegisterFormVisible là true */}
      {isRegisterFormVisible && (
        <RegisterPage onClose={handleCloseRegisterForm} />
      )}
    </>
  );
}
