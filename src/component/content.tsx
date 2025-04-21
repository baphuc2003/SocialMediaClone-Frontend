/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useState } from "react";

import { useEffect, useState } from "react";
import authorizedAxiosInstance from "../utils/authorizedAxios";
import axios, { AxiosError } from "axios";

// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";
import { Comments } from "./comments";

interface User {
  id: string;
  name: string;
  status: string;
  role: string;
  avatar: string;
}

export interface Post {
  id: string;
  user: User;
  type: string;
  content: string;
  mediaUrls: { url: string; type: string }[];
  userView: number;
  like: number;
  shared: number;
  created_at: string;
  point: number;
  day_ago: number;
}

export function Content() {
  const renderContentWithHashtags = (text: string) => {
    const hashtagRegex = /#\w+/g; // Tìm các hashtag
    const parts = text.split(hashtagRegex); // Chia nội dung thành các phần không chứa hashtag

    const matches = text.match(hashtagRegex); // Lấy danh sách hashtag

    // Kết hợp lại với các hashtag được định dạng
    return parts.map((part, index) => (
      <>
        {part}
        {matches && matches[index] && (
          <span key={index} className="text-blue-500 font-bold">
            {matches[index]}
          </span>
        )}
      </>
    ));
  };
  // const [isShowComment, setIsShowComment] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState("");
  const [selectedUserRootId, setSelectedUserRootId] = useState("");
  const [listPost, setListPost] = useState<Post[]>([]);
  console.log("check 58 ", listPost);
  const [page, setPage] = useState(1);
  useEffect(() => {
    const getListPost = async () => {
      try {
        const res = await authorizedAxiosInstance.get(
          `https://socialmediaclone-backend-1.onrender.com/api/post/get-list-post?page=${page}`
        );
        // eslint-disable-next-line no-unsafe-optional-chaining
        setListPost((prev) => [...prev, ...res.data?.data]);
      } catch (error) {
        console.log(error);
      }
    };
    getListPost();
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setPage((page) => page + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  const handleLikePost = async (postId: string) => {
    try {
      const res = await axios.post(
        "https://socialmediaclone-backend-1.onrender.com/api/post/like-post",
        { postId },
        { withCredentials: true }
      );

      if (res.status === 201 || res.status === 200) {
        setListPost((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, like: post.like + 1 } : post
          )
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.status == 400) {
          const res = await axios.post(
            "https://socialmediaclone-backend-1.onrender.com/api/post/unlike-post",
            { postId },
            { withCredentials: true }
          );

          if (res.status === 201 || res.status === 200) {
            setListPost((prevPosts) =>
              prevPosts.map((post) =>
                post.id === postId ? { ...post, like: post.like - 1 } : post
              )
            );
          }
        }
      } else {
        console.error("Unexpected Error:", error);
      }
    }
  };

  const handleShowComment = ({
    postId,
    userRootId,
  }: {
    postId: string;
    userRootId: string;
  }) => {
    setSelectedPostId(postId);
    setSelectedUserRootId(userRootId);
    document.body.style.overflow = "hidden";
  };

  const closeCommentBox = () => {
    setSelectedPostId("");
    document.body.style.overflow = "auto";
  };

  // Tìm bài viết được chọn từ listPost
  const selectedPost = listPost.find((post) => post.id === selectedPostId);

  return (
    <>
      <div className="c flex-1 ">
        {listPost.map((post) => (
          <div className="p-3 border-y-[1px] border-[#2f3336] " key={post.id}>
            {/* <h1>{post.content}</h1>
              <p>{post.point}</p> */}
            <div className="flex gap-3">
              <div className="avat w-8 h-8 basic-[15%]">
                <img
                  className="rounded-full"
                  src={
                    post.user.avatar ||
                    "https://social-network-clone.s3.ap-southeast-1.amazonaws.com/avatar-macdinh.jpg"
                  }
                  alt="Post Media"
                />
              </div>

              <div className="basic-[85%] w-full ">
                <div className="flex gap-2 mb-2">
                  <div
                    className="name font-bold
                    "
                  >
                    {post.user.name}
                  </div>
                  <div className="time text-[#71767b]">
                    {post.day_ago} day ago
                  </div>
                </div>
                <div className="cont mb-2">
                  <p>{renderContentWithHashtags(post.content)}</p>
                </div>

                <div className="media">
                  <div className="flex justify-center items-center flex-wrap  rounded-xl gap-2">
                    {post.mediaUrls &&
                      post.mediaUrls.map((media, index) => {
                        if (media.type === "image") {
                          return (
                            <img
                              key={media.url}
                              className="w-[50%] h-auto object-cover rounded-lg border-[1px] border-[#2f3336] p-4"
                              src={media.url}
                              //   src="https://social-network-clone.s3.ap-southeast-1.amazonaws.com/25fe4cfa-cb96-4461-a45c-13db1408f639-204858072_An+Suong+-+Quang+Ngai_18_00_2024-09-28_A08.jpg"
                              alt={`Post Media ${index}`}
                            />
                          );
                        }
                        if (media.type === "video" && index === 0) {
                          return (
                            <video
                              key={media.url}
                              className="w-full rounded-lg"
                              controls
                              src={media.url}
                            >
                              Your browser does not support the video tag.
                            </video>
                          );
                        }
                        return null;
                      })}
                  </div>
                </div>

                <div className="evalute mt-3">
                  <div className=" flex gap-12 items-center">
                    <div
                      onClick={() => handleLikePost(post.id)}
                      className=" like flex gap-1 cursor-pointer text-[#DA244B]"
                    >
                      <div className="ico">
                        <i className="fa-solid fa-heart"></i>
                      </div>
                      <div className="num">{post.like}</div>
                    </div>

                    <div
                      onClick={() =>
                        handleShowComment({
                          postId: post.id,
                          userRootId: post.user.id,
                        })
                      }
                      className="comment flex gap-1 cursor-pointer text-[#00CAFF]"
                    >
                      <div className="ico">
                        <i className="fa-solid fa-comment"></i>
                      </div>
                      <div className="num">10</div>
                    </div>

                    <div className="share flex gap-1 cursor-pointer text-[#00A465]">
                      <div className="ico">
                        <i className="fa-solid fa-share"></i>
                      </div>
                      <div className="num">{post.shared}</div>
                    </div>

                    <div className="view flex gap-1 cursor-pointer text-[#502380]">
                      <div className="ico">
                        <i className="fa-solid fa-chart-simple"></i>
                      </div>
                      <div className="num">{post.userView}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPostId && selectedPost && (
        <Comments
          commentParam={{
            postRootId: selectedPostId,
            startRootId: selectedPostId,
            userRootId: selectedUserRootId,
          }}
          onClose={closeCommentBox}
        />
      )}
    </>
  );
}
