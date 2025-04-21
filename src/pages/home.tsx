/* eslint-disable @typescript-eslint/no-unused-vars */
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState } from "react";
import { DropDownMessage } from "../component/drop-down-message";
import { ListFriend } from "../component/list-friend";
import { FormCreatePost } from "../component/form-create-post";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authorizedAxiosInstance from "../utils/authorizedAxios";
import { Content } from "../component/content";
import { ChatBox } from "../component/chat-box";
import { Link } from "react-router-dom";

interface FollowingUser {
  id: string;
  username: string;
  image: string;
}

interface SearchResult {
  id: number;
  name: string;
}
export function HomePage() {
  // const [user, setUser] = useState(null);
  const [isDropdownOpenMessage, setIsDropdownOpenMessage] = useState(false);
  // const [isOpenChat, setIsOpenChat] = useState(false);
  const [query, setQuery] = useState("");
  console.log("check query ", query);
  const [results, setResults] = useState<SearchResult[]>([]);
  console.log("check 29 ", results);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [notifications] = useState<string[]>([
    "Thông báo 1: Cập nhật hệ thống",
    "Thông báo 2: Tin nhắn mới từ bạn A",
    "Thông báo 3: Yêu cầu kết bạn",
  ]);
  const [currentChatUser, setCurrentChatUser] = useState<FollowingUser | null>(
    null
  );

  const toggleDropdown = (event: React.MouseEvent) => {
    event.stopPropagation(); // Ngăn xử lý sự kiện click bên ngoài
    setIsDropdownOpenMessage((prev) => !prev);
  };

  const openChatBox = (user: FollowingUser) => {
    setCurrentChatUser(user);
  };

  const closeChatBox = () => {
    setCurrentChatUser(null);
  };

  const fetchResults = async (searchTerm: string) => {
    if (!searchTerm) {
      setResults([]);
      setShowResults(false);
      return;
    }

    try {
      const response = await authorizedAxiosInstance.get(
        "https://socialmediaclone-backend-1.onrender.com/api/elasticsearch/users",
        { params: { q: searchTerm } }
      );

      if (response.data) {
        setResults(response.data.data);
        setShowResults(response.data?.data.length > 0);
      } else {
        setResults([]);
        setShowResults(false);
      }
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    }
  };

  let debounceTimeout: number | undefined;
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      fetchResults(val);
    }, 300);
  };

  return (
    <>
      <div className="container min-w-full bg-black_#000000 ">
        <div className="wrap flex text-white_#f0f8ff">
          <div className="left basis-[25%] min-h-screen border-r border-[#2f3336] fixed top-0 left-0 w-[25%]">
            <div className="col flex flex-col">
              <div className="logo mx-3 py-2 flex items-center gap-3">
                <div className="">
                  <img
                    src="https://social-network-clone.s3.ap-southeast-1.amazonaws.com/logoSocial.jpeg"
                    alt="Logo"
                    className="h-10 rounded-full "
                  />
                </div>

                <div className="inputSearch px-3 py-1 bg-[#202327] rounded-full basic-[90%] w-full">
                  <input
                    type="text"
                    className="outline-none text-[#b0b3b8] h-7 bg-[#202327] "
                    placeholder="Mày muốn tìm gì?"
                    onChange={handleSearch}
                  />
                  {showResults && (
                    <div className="resultBox absolute bg-[#202327] w-[80%] left-[17%] mt-2 rounded-lg shadow-md">
                      <ul>
                        {results.map((item) => (
                          <li
                            key={item.id}
                            className="px-3 py-2 text-[#e2e5e9] hover:bg-gray-700 cursor-pointer"
                          >
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="gr_item mx-3">
                <nav className="flex flex-col">
                  <a href="#" className="w-full group">
                    <div className="item inline-block group-hover:bg-[#5b708366] transition duration-300 rounded-full">
                      <div className="flex items-center p-3">
                        <div className="icon w-6 h-6">
                          <i className="fa-solid fa-user-group"></i>
                        </div>
                        <div className="mx-5">
                          <span>Bạn bè</span>
                        </div>
                      </div>
                    </div>
                  </a>

                  <a href="#" className="w-full group">
                    <div className="item inline-block group-hover:bg-[#5b708366] transition duration-300 rounded-full">
                      <div className="flex items-center p-3">
                        <div className="icon w-6 h-6">
                          <i className="fa-solid fa-bookmark"></i>
                        </div>
                        <div className="mx-5">
                          <span>Đã lưu</span>
                        </div>
                      </div>
                    </div>
                  </a>

                  <a href="#" className="w-full group">
                    <div className="item inline-block group-hover:bg-[#5b708366] transition duration-300 rounded-full">
                      <div className="flex items-center p-3">
                        <div className="icon w-6 h-6">
                          <i className="fa-solid fa-layer-group"></i>
                        </div>
                        <div className="mx-5">
                          <span>Nhóm</span>
                        </div>
                      </div>
                    </div>
                  </a>

                  <Link to="/user/phucba" className="w-full group">
                    <div className="item inline-block group-hover:bg-[#5b708366] transition duration-300 rounded-full">
                      <div className="flex items-center p-3">
                        <div className="icon w-6 h-6">
                          <i className="fa-solid fa-user"></i>
                        </div>
                        <div className="mx-5">
                          <span>Hồ sơ</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </nav>
              </div>

              <div className="btnPost mt-10">
                {/* <button className="px-8 py-5 bg-[#1d9bf0]">Đăng bài</button> */}
                <a
                  href=""
                  className="bg-[#1d9bf0] ml-3 px-10 py-4 rounded-full hover:bg-[#5b708366] hover:text-[#F3453F] transition duration-300 "
                >
                  <span>Đăng bài</span>
                </a>
              </div>
            </div>
          </div>

          <div className="main basis-[50%] ml-[25%] overflow-y-auto">
            <div className="formCreatePost ">
              <FormCreatePost />
            </div>
            <div className="content flex  max-h-screen">
              <Content />
            </div>
          </div>

          <div className="right basis-[25%] min-h-screen border-l border-[#2f3336] fixed top-0 right-0 w-[25%]">
            <div className="t flex justify-end gap-3 py-3 px-2 border-b border-[#2f3336]">
              <div className="relative">
                <i
                  onClick={toggleDropdown}
                  className="fa-solid fa-bell p-3 rounded-full bg-[#202327] cursor-pointer"
                ></i>

                {/* Số lượng thông báo */}
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                  {/* {notificationCount} */}
                </div>
              </div>
              {/* Dropdown danh sách thông báo */}
              {isDropdownOpenMessage && (
                <DropDownMessage
                  notifications={notifications}
                  onClose={() => setIsDropdownOpenMessage(false)}
                />
              )}
              <div className="relative">
                <i className="fa-solid fa-user p-3 rounded-full bg-[#202327] cursor-pointer"></i>
              </div>
            </div>

            <div className="b">
              <div className="">
                <span className="text-white_#f0f8ff text-xl ml-2">
                  Người liên hệ
                </span>
              </div>
              <ListFriend onUserClick={openChatBox} />
              {currentChatUser && (
                <ChatBox
                  closeUserClick={closeChatBox}
                  friend={{
                    id: currentChatUser.id,
                    username: currentChatUser.username,
                    image: currentChatUser.image,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
