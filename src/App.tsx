/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import "./index.css";
import { Welcome } from "./pages/welcome";
import { HomePage } from "./pages/home";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { ProfilePage } from "./layout/profilePage";
import { RegisterPage } from "./pages/registration";
function App() {
  const AuthorizedRoute = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      return <Navigate to="/home" replace={true} />;
    }
    return <Outlet />;
  };

  const ProtectedRoute = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      return <Navigate to="/" replace={true} />;
    }
    return <Outlet />;
  };
  const [, setSocket] = useState<Socket>();
  const [, setNotification] = useState<{
    username: string;
    gender: string;
    image: string;
  } | null>(null);
  useEffect(() => {
    const socket = io(`https://socialmediaclone-backend-1.onrender.com/`, {
      query: {
        userId: localStorage.getItem("userInfo"),
      },
    });
    setSocket(socket);
    // Các sự kiện socket sau khi kết nối
    socket.on("connect", () => {
      console.log("Đã kết nối tới chat socket");
    });

    socket.on(
      "friend-request-received",
      (data: { username: string; gender: string; image: string }) => {
        setNotification(data);
        console.log("check 44 ", data);
      }
    );
    return () => {
      socket.disconnect();
      console.log("Ngắt kết nối chat socket");
    };
  }, []);
  return (
    <>
      {/* Định nghĩa Routes */}
      <BrowserRouter basename="/">
        <Routes>
          {/* <Route path="/" element={<Navigate to="/login" replace={true} />} /> */}

          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="user/phucba" element={<ProfilePage />} />
          </Route>
          <Route element={<AuthorizedRoute />}>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Welcome />} />
            <Route
              path="/register"
              element={<RegisterPage onClose={() => {}} />}
            />
          </Route>

          <Route path="*" element={<div>Không tìm thấy trang</div>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

// 1 -> 10;
// 7 / 10
