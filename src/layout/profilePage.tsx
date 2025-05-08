/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import authorizedAxiosInstance from "../utils/authorizedAxios";
import { useParams } from "react-router-dom";
import { ChatBox } from "../component/chat-box";

// interface UserProfileHeaderProps {
//   coverImage?: string;
//   currentUserId: string;
//   profileUserId: string;
// }

export interface IUser {
  id: string;
  username: string;
  image: string;
  gender: "Male" | "Female" | string;
}

export interface IFollow {
  id: string;
  created_at: string;
  user: IUser;
  followingUser: IUser;
}

interface IProfileUser {
  id: string;
  username: string;
  email: string;
  gender: string;
  status: string;
  image: string;
  followingCount: number;
}

export function ProfilePage() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [profileUser, setProfileUser] = useState<IProfileUser | null>(null);

  const { username } = useParams();
  const [profileUserId, setProfileUserId] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const isOwner = currentUserId === profileUserId;

  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<IUser | null>(null);
  const [, setIsLoadingFollow] = useState(false);

  useEffect(() => {
    const fetchUserIdByUsername = async () => {
      try {
        console.log("name", username);
        const res = await authorizedAxiosInstance.get(
          // `http://localhost:3000/api/user/get-profile/${username}`
          `https://socialmediaclone-backend-1.onrender.com/api/user/get-profile/${username}`
        );
        const userData = res.data?.data?.user;

        if (userData) {
          setProfileUser(userData);
          setProfileUserId(userData.id);
        }
      } catch (err) {
        console.error("Không tìm thấy người dùng:", err);
      }
    };

    const userInfo = sessionStorage.getItem("userInfo") || "";
    if (userInfo) setCurrentUserId(userInfo);

    if (username) {
      fetchUserIdByUsername();
    }
  }, [username]);

  const fetchFollowingList = async () => {
    try {
      const res = await authorizedAxiosInstance.get<{ data: IFollow[] }>(
        "https://socialmediaclone-backend-1.onrender.com/api/user/get-list-follow"
      );

      const followingList = res.data?.data ?? [];
      const found = followingList.some(
        (follow) =>
          follow.user.id === currentUserId &&
          follow.followingUser.id === profileUserId
      );
      setIsFollowing(found);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách follow:", err);
    }
  };

  useEffect(() => {
    if (!isOwner) {
      fetchFollowingList();
    }
  }, [currentUserId, profileUserId, isOwner]);

  const handleFollowToggle = async () => {
    try {
      setIsLoadingFollow(true);

      const url = isFollowing
        ? "https://socialmediaclone-backend-1.onrender.com/api/user/unfollow"
        : "https://socialmediaclone-backend-1.onrender.com/api/user/follow";

      const body = {
        following_user_id: profileUserId,
      };

      // Cập nhật UI ngay lập tức trước khi gọi API
      setIsFollowing((prev) => !prev); // Đổi trạng thái nút

      // Gọi API
      const response = await authorizedAxiosInstance.post(url, body);
      console.log("check follow", response);

      if (response.status === 200) {
        setIsHovering(false); // Reset hover effect
      }
    } catch (err) {
      console.error("Lỗi khi gọi API follow/unfollow:", err);
      // Nếu có lỗi, reset lại trạng thái theo dõi UI
      setIsFollowing((prev) => !prev); // Nếu API fail, đảo lại trạng thái
    } finally {
      setIsLoadingFollow(false);
    }
  };

  return (
    <>
      <div className="relative min-h-screen">
        {/* Lớp nền mờ xám */}
        <div className="fixed inset-0 bg-[#000000] z-0" />

        <div className="relative flex justify-center">
          {/* Ảnh nền */}
          <div className="h-60 md:h-72 lg:h-80 w-[80%] overflow-hidden rounded-bl-2xl rounded-br-2xl">
            {/* {coverImage ? (
            <img
              src={coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#333639]" />
          )} */}
            <div className="w-full h-full bg-[#333639]" />
          </div>

          {/* Avatar và tên + nút */}
          <div className="absolute -bottom-24 flex gap-4 justify-between items-center w-[80%] px-6">
            <div className="flex gap-4 items-center">
              <img
                src={
                  profileUser?.image ||
                  "https://social-network-clone.s3.ap-southeast-1.amazonaws.com/avatar-macdinh.jpg"
                }
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-white"
              />
              <h1 className="text-2xl font-bold text-white drop-shadow">
                {profileUser?.username || "Đang tải..."}
              </h1>
            </div>

            {isOwner ? (
              <button className="bg-white text-[#080809] rounded-md text-sm h-9 min-w-[200px] font-bold">
                Chỉnh sửa trang cá nhân
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedFriend(profileUser); // cần đảm bảo profileUser không null
                    setIsChatBoxOpen(true);
                  }}
                  className="bg-white text-[#080809] rounded-md text-sm h-9 min-w-[100px] font-bold hover:bg-[#94959666] duration-200"
                >
                  Nhắn tin
                </button>
                <button
                  className={`rounded-md text-sm h-9 min-w-[100px] font-bold transition-colors duration-200
    ${
      isFollowing
        ? isHovering
          ? "bg-red-600 text-white"
          : "bg-white text-[#080809]"
        : "bg-white text-[#080809]"
    }
  `}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  onClick={handleFollowToggle}
                >
                  {isFollowing
                    ? isHovering
                      ? "Bỏ theo dõi"
                      : "Đã theo dõi"
                    : "Theo dõi"}
                </button>
              </div>
            )}
          </div>

          <div className="absolute w-[80%] -bottom-96 text-white bg-[#252728] h-60 rounded-2xl">
            <div className="">
              <h3 className="ml-3 mt-3">Giới thiệu:</h3>

              <div className="flex flex-col ml-5 mt-3">
                <span>Email: {profileUser?.email}</span>
                <span>
                  Giới tính: {profileUser?.gender === "Male" ? "Nam" : "Nữ"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {isChatBoxOpen && selectedFriend && (
          <div className="fixed bottom-0 w-[25%] right-0 z-[9999]">
            <ChatBox
              closeUserClick={() => setIsChatBoxOpen(false)}
              friend={selectedFriend}
            />
          </div>
        )}
      </div>
    </>
  );
}
