/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { toast } from "react-toastify";
import authorizedAxiosInstance from "../utils/authorizedAxios";

interface Post {
  type: string;
  userId: string;
  parentId: string | null;
  content: string;
  isExistMedia: boolean;
  view: number;
  like: number;
  shared: number;
}

export function FormCreatePost() {
  const [file, setFile] = useState<File[]>([]);
  const [post, setPost] = useState<Post>({
    type: "comment",
    userId: localStorage.getItem("userInfo") as string,
    parentId: null,
    content: "",
    isExistMedia: false,
    view: 0,
    like: 0,
    shared: 0,
  });

  const handleClick = () => {
    document.getElementById("fileInput")!.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      const fileArray = Array.from(files); // Chuyển FileList thành mảng
      if (fileArray.length <= 4) {
        setFile(fileArray);
        setPost((prev) => ({ ...prev, isExistMedia: fileArray.length > 0 }));
      } else {
        toast.error("Số lượng file tối đa có thể đăng là 4");
        setFile([]);
        setPost((prev) => ({ ...prev, isExistMedia: false }));
      }
    }
  };

  const handleChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPost((prev) => ({
      ...prev,
      content: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post.content.trim() && file.length === 0) {
      toast.error("Nội dung hoặc file phải được cung cấp!");
      return;
    }

    const formData = new FormData();
    formData.append("post", JSON.stringify(post));
    file.forEach((f) => {
      formData.append("file", f);
    });

    for (const pair of formData.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }

    try {
      const res = await authorizedAxiosInstance.post(
        "https://socialmediaclone-backend-1.onrender.com/api/post/create-post",
        formData
      );
      console.log("check 71 ", res);
      if (res.status === 200 || res.status === 201) {
        toast.success("Tạo bài viết mới thành công!");
        setPost((prevPost) => ({
          ...prevPost,
          content: "",
          isExistMedia: false,
        }));
        setFile([]); // Reset danh sách file sau khi gửi
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="box flex p-3 gap-3 mb-3 border-b-[1px] border-[#2f3336]">
        <div className="ava basic-[20%] flex items-start">
          <img
            src="https://social-network-clone.s3.ap-southeast-1.amazonaws.com/logoSocial.jpeg"
            alt="Logo"
            className="h-10 rounded-full "
          />
        </div>

        <div className="con basic-[80%] w-full">
          <div className="flex flex-col">
            <div className="w-full">
              <textarea
                value={post.content}
                onChange={handleChangeContent}
                rows={5}
                placeholder="Viết di chúc đi!"
                className="w-full text-white_#f0f8ff bg-black_#000000 outline-none border-[1px] border-[#2f3336]"
              ></textarea>
            </div>

            {/* Hiển thị ảnh đã chọn */}
            {file.length > 0 && (
              <div className="preview-images mt-2 flex gap-2 flex-wrap">
                {file.map((f, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(f)}
                      alt={`Preview ${index}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    {/* Nút xóa ảnh */}
                    <button
                      onClick={() => {
                        setFile((prev) => prev.filter((_, i) => i !== index));
                        setPost((prev) => ({
                          ...prev,
                          isExistMedia: file.length - 1 > 0,
                        }));
                      }}
                      className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex py-1">
              <div className="icon basic-[70%] w-full flex gap-3">
                <div className="flex justify-center items-center w-7 h-7 rounded-full hover:bg-[#787a7a] duration-300">
                  <i
                    onClick={handleClick}
                    className="fa-solid fa-image items-center text-[#1d9bf0]"
                  ></i>
                  <input
                    id="fileInput"
                    type="file"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>
                {/* <div className="flex justify-center items-center w-7 h-7 rounded-full hover:bg-[#787a7a] duration-300">
                  <i className="fa-solid fa-file items-center text-[#1d9bf0]"></i>
                </div>
                <div className="flex justify-center items-center w-7 h-7 rounded-full hover:bg-[#787a7a] duration-300">
                  <i className="fa-solid fa-face-smile items-center text-[#1d9bf0]"></i>
                </div> */}
              </div>
              <div className="btn_post basic-[30%] w-full flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="py-2 px-5 rounded-full bg-[#787a7a]"
                >
                  Đăng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
