/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import authorizedAxiosInstance from "../utils/authorizedAxios";

interface NotificationDropdownProps {
  notifications: string[];
  onClose: () => void;
}

interface Sender {
  username: string;
  gender: string;
  image: string;
}

interface NotificationItem {
  type: string;
  data: {
    message: string;
  };
  isRead: boolean;
  sender: Sender;
  createdAt: Date;
}

export function DropDownMessage({ onClose }: NotificationDropdownProps) {
  const [notification, setNotification] = useState<NotificationItem[]>([]);
  const [page] = useState(1);
  const receiverId = localStorage.getItem("userInfo");
  console.log("check 15 ", notification);
  // const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await authorizedAxiosInstance.get(
          `https://socialmediaclone-backend-1.onrender.com/api/notification/get-list-notification?receiverId=${receiverId}&page=${page}`
        );
        setNotification(res.data?.data); // Giả sử response trả về là mảng thông báo
      } catch (err) {
        console.error("Lỗi khi lấy danh sách thông báo:", err);
      }
    };

    fetchNotifications();
  }, []);

  const getRelativeTime = (date: string) => {
    const now = new Date();
    const commentTime = new Date(date);
    const diffMs = now.getTime() - commentTime.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return `${diffSeconds} giây`;
    if (diffMinutes < 60) return `${diffMinutes} phút`;
    if (diffHours < 24) return `${diffHours} giờ`;
    if (diffDays < 30) return `${diffDays} ngày`;
    return commentTime.toLocaleString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose(); // Gọi hàm đóng dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <>
      <div
        ref={dropdownRef}
        className="absolute w-full right-0 top-14 bg-[#252728] shadow-lg rounded-lg p-4 z-50 w-[25%]"
      >
        <h4 className="font-bold text-white_#f0f8ff mb-2 text-2xl">
          Thông báo
        </h4>
        <div className="overflow-y-auto">
          {notification.map((item, index) => {
            // Nếu image rỗng, dùng ảnh theo giới tính
            const fallbackImage =
              item.sender.gender === "Male"
                ? "https://social-network-clone.s3.ap-southeast-1.amazonaws.com/avatar-macdinh.jpg"
                : "https://example.com/avatar-female.png";

            const imageToShow =
              item.sender.image !== "" ? item.sender.image : fallbackImage;

            return (
              <div key={index} className="">
                <div className=" hover:bg-[#3b3d3e] rounded-xl">
                  <div className="m-1 flex items-start gap-2 cursor-pointer">
                    <div className="w-8 h-8 m-1">
                      <img className=" rounded-full" src={imageToShow} alt="" />
                    </div>

                    <div className="noti flex flex-col">
                      <span>{item.data.message}</span>
                      <span className="text-[#5aa7ff]">
                        {getRelativeTime(item.createdAt.toString())}
                      </span>

                      {/* Nếu là FRIEND_REQUEST thì hiển thị 2 nút */}
                      {item.type === "FRIEND_REQUEST" && (
                        <div className="flex gap-2 mt-2 pb-2">
                          <button
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                            onClick={() => console.log("Đồng ý kết bạn:", item)}
                          >
                            Đồng ý
                          </button>
                          <button
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                            onClick={() =>
                              console.log("Từ chối kết bạn:", item)
                            }
                          >
                            Từ chối
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
