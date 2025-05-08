/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import authorizedAxiosInstance from "../utils/authorizedAxios";

interface FollowingUser {
  id: string;
  username: string;
  image: string;
}

interface ChatBoxProps {
  closeUserClick: () => void;
  friend: FollowingUser | null;
}

interface IChats {
  content: string;
  isSender: boolean;
  created_at: Date;
}

interface IChat {
  senderId?: string;
  receiverId?: string;
  content: string;
  created_at?: Date;
}

export function ChatBox({ closeUserClick, friend }: ChatBoxProps) {
  const [valChat, setValChat] = useState<IChat>({
    content: "",
    created_at: new Date(),
  });
  const [valChats, setValChats] = useState<IChats[]>([]);

  const [socket, setSocket] = useState<Socket>();

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

    // Lắng nghe sự kiện 'receiveMessage' từ server
    socket.on(
      "receiveMessage",
      (data: { senderId: string; content: string }) => {
        console.log("Nhận tin nhắn: ", data);
        setValChats((prev) => [
          ...prev,
          {
            content: data.content,
            isSender: false,
            created_at: new Date(),
          },
        ]);
      }
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authorizedAxiosInstance.get(
          // `http://localhost:3000/api/conversation/get-single-conversation/receiver/${friend?.id}`
          `https://socialmediaclone-backend-1.onrender.com/api/conversation/get-single-conversation/receiver/${friend?.id}`
        );
        // if (!response.ok) {
        //   throw new Error(`Error: ${response.status} ${response.statusText}`);
        // }
        // const result = await response.json();

        if (response.status == 200) {
          const messages = response.data?.data.map((msg: IChat) => ({
            ...msg,
            isSender: msg.senderId === localStorage.getItem("userInfo"), // So sánh với userId hiện tại để xác định tin nhắn của ai
          }));
          setValChats(messages);
          console.log("check 82 ", response);
        }
      } catch (err) {
        // setErro(err.message);
        console.log("check 80 ", err);
      }
    };

    fetchData();
  }, []);

  const handleSendMessage = () => {
    if (socket && friend) {
      socket.emit("sendMessage", {
        senderId: localStorage.getItem("userInfo"),
        receiverId: friend.id,
        content: valChat.content,
        created_at: valChat.created_at,
      });

      setValChats((message) => [
        ...message,
        {
          content: valChat.content,
          isSender: true,
          created_at: valChat.created_at || new Date(),
        },
      ]);

      setValChat({
        content: "",
      });
    }
  };

  return (
    <>
      <div className="chat-box p-3 fixed w-[25%] bottom-0">
        <div className="box border-[1px] rounded-lg bg-[#242526]">
          <div className="head-box flex justify-between px-3 py-2 border-b-[1px]">
            <div className="info flex gap-2 items-center">
              <div className="ava w-8 h-8 ">
                <img
                  src={
                    friend?.image ||
                    "https://social-network-clone.s3.ap-southeast-1.amazonaws.com/avatar-macdinh.jpg"
                  }
                  alt=""
                  className="rounded-full"
                />
              </div>

              <div className="name">
                <span className="text-[#e2e5e9] font-semibold">
                  {friend?.username}
                </span>
              </div>
            </div>

            <div className="opti flex gap-4 items-start">
              <div className="camera cursor-pointer h-6 w-6 text-center rounded-full hover:bg-slate-400 duration-300">
                <i className="fa-solid fa-video text-[#502380]"></i>
              </div>

              <div
                onClick={closeUserClick}
                className="exit cursor-pointer h-6 w-6 text-center rounded-full hover:bg-slate-400 duration-300"
              >
                <i className="fa-solid fa-xmark text-[#502380]"></i>
              </div>
            </div>
          </div>

          <div className="main_content h-80 overflow-y-auto">
            <div className="flex flex-col gap-4 p-4">
              {valChats.map((dta) => (
                <div
                  className={`flex ${
                    dta.isSender ? "justify-end" : "justify-start"
                  }`}
                >
                  <p
                    className={`max-w-[70%] rounded-lg p-3 ${
                      dta.isSender
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {dta.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="footer_box py-3 px-2 flex gap-4 items-center border-t-[1px]">
            <div className="basic-[80%] w-full">
              <input
                className="w-full outline-none bg-[#202327] text-white_#f0f8ff py-2 px-2 rounded-lg"
                type="text"
                value={valChat.content}
                placeholder="Aa"
                onChange={(e) => {
                  setValChat({
                    content: e.target.value,
                    created_at: new Date(),
                  });
                  // setDataChat((prev) => [
                  //   // ...prev,
                  //   {
                  //     time: "30h",
                  //     content: e.target.value,
                  //   },
                  // ]);
                }}
              />
            </div>

            <div
              onClick={handleSendMessage}
              className="send basic-[20%] text-white_#f0f8ff p-2 text-center rounded-full hover:bg-slate-400 duration-300"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
