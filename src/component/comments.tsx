/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import authorizedAxiosInstance from "../utils/authorizedAxios";
import { toast } from "react-toastify";

interface IUser {
  id: string;
  username: string;
  gender: string;
  image: string;
}

interface IComment {
  _id: string;
  userId: string;
  parentId: string | null;
  content: string;
  postRootId: string;
  created_at: string;
  __v: number;
  user?: IUser; // Đặt user là optional để xử lý trường hợp thiếu
  replyCount: number;
  replies?: IComment[];
}

interface ICommentParam {
  postRootId: string;
  startRootId: string;
  userRootId: string;
}

export function Comments({
  onClose,
  commentParam,
}: {
  onClose: () => void;
  commentParam: ICommentParam;
}) {
  const [comment, setComment] = useState<IComment[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});
  const [newCommentContent, setNewCommentContent] = useState<string>("");

  // const uriComment = `http://localhost:3000/api/comments/get-comment/${commentParam.postRootId}/${commentParam.startRootId}`;
  const uriComment = `https://socialmediaclone-backend-1.onrender.com/api/comments/get-comment/${commentParam.postRootId}/${commentParam.startRootId}`;

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authorizedAxiosInstance.get(uriComment);
      setComment(res.data?.result || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [commentParam.postRootId, commentParam.startRootId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const getRelativeTime = useCallback((date: string) => {
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
  }, []);

  const handleSubmitNewComment = async () => {
    if (!newCommentContent.trim()) {
      toast.error("Vui lòng nhập bình luận!");
      return;
    }

    const uriCreateComment = `https://socialmediaclone-backend-1.onrender.com/api/comments/create-comment`;
    const commentData = {
      comment: {
        content: newCommentContent,
        postRootId: commentParam.postRootId,
        userRootId: commentParam.userRootId,
        parentId: null,
      },
    };

    try {
      const res = await authorizedAxiosInstance.post(
        uriCreateComment,
        commentData
      );
      console.log("check 200 new comment ", res);
      if (res.data?.result) {
        const newComment = res.data.result;
        console.log("New comment structure:", newComment); // Debug cấu trúc
        setComment((prevComments) =>
          prevComments ? [...prevComments, newComment] : [newComment]
        );
        setNewCommentContent("");
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      toast.error("Không thể gửi bình luận!");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!comment) return <div>No comment found</div>;

  return (
    <div className="comment-box overscroll-auto fixed w-full h-full top-0 left-0 flex justify-center items-center">
      <div className="container flex flex-col w-[50%] justify-center bg-[#ffffff] h-[100%]">
        <div className="h_comment bg-[#252728] basis-[10%] flex w-full border-b-[1px] border-[#2f3336]">
          <div className="basis-[80%] w-full flex justify-center items-center">
            <span className="text-2xl text-[#e2e5e9]">Nội dung bình luận</span>
          </div>
          <div className="basis-[20%] flex justify-center items-center px-3">
            <button
              onClick={onClose}
              className="text-black w-7 h-7 rounded-full bg-[#e2e5e9]"
            >
              X
            </button>
          </div>
        </div>

        <div className="b_comment basis-[75%] overflow-y-auto bg-[#252728] text-[#dfe2e6]">
          {comment && comment.length > 0 ? (
            comment.map((cmt) => (
              <CommentItem
                key={cmt._id}
                cmt={cmt}
                getRelativeTime={getRelativeTime}
                setComment={setComment}
                userRootId={commentParam.userRootId}
                fetchComments={fetchComments}
                expandedComments={expandedComments}
                setExpandedComments={setExpandedComments}
              />
            ))
          ) : (
            <div className="p-4 text-center text-[#71767b]">
              Chưa có bình luận nào
            </div>
          )}
        </div>

        <div className="f_comment basis-[15%] bg-[#252728] flex justify-center items-center">
          <div className="w-full flex">
            <textarea
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              placeholder="Viết bình luận..."
              className="w-full p-2 border outline-none border-gray-300 rounded resize-y min-h-[80px] text-[#f0f8ff] bg-[#333334]"
            />
            <div
              onClick={handleSubmitNewComment}
              className="text-[#f0f8ff] p-2 text-center rounded-full flex items-center cursor-pointer hover:bg-[#444]"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CommentItem = ({
  cmt,
  getRelativeTime,
  setComment,
  userRootId,
  fetchComments,
  expandedComments,
  setExpandedComments,
}: {
  cmt: IComment;
  getRelativeTime: (date: string) => string;
  setComment: React.Dispatch<React.SetStateAction<IComment[] | null>>;
  userRootId: string;
  fetchComments: () => Promise<void>;
  expandedComments: Record<string, boolean>;
  setExpandedComments: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}) => {
  const [isReply, setIsReply] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);

  const handleReply = useCallback(() => {
    setIsReply(true);
  }, []);

  const addReplyToComment = (
    comments: IComment[],
    parentId: string,
    newReply: IComment
  ): IComment[] => {
    return comments.map((comment) => {
      if (comment._id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply],
          replyCount: comment.replyCount + 1,
        };
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: addReplyToComment(comment.replies, parentId, newReply),
        };
      }
      return comment;
    });
  };

  const handleSubmitReply = async () => {
    if (!inputValue.trim()) {
      toast.error("Vui lòng nhập bình luận!");
      return;
    }

    const uriCreateComment = `https://socialmediaclone-backend-1.onrender.com/api/comments/create-comment`;
    const commentData = {
      comment: {
        content: inputValue,
        postRootId: cmt.postRootId,
        userRootId: userRootId,
        parentId: cmt._id,
      },
    };

    try {
      const res = await authorizedAxiosInstance.post(
        uriCreateComment,
        commentData
      );
      console.log("check 200 reply ", res);
      if (res.data?.result) {
        const newComment = res.data.result;
        setComment((prevComments) =>
          prevComments
            ? addReplyToComment(prevComments, cmt._id, newComment)
            : null
        );
        setInputValue("");
        setIsReply(false);
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      toast.error("Không thể gửi bình luận!");
    }
  };

  const updateReplies = useCallback(
    (
      comments: IComment[],
      targetId: string,
      newReplies: IComment[]
    ): IComment[] => {
      return comments.map((comment) => {
        if (comment._id === targetId) {
          return { ...comment, replies: newReplies };
        }
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: updateReplies(comment.replies, targetId, newReplies),
          };
        }
        return comment;
      });
    },
    []
  );

  const handleGetReply = async ({
    postRootId,
    startRootId,
  }: {
    postRootId: string;
    startRootId: string;
  }) => {
    const uriGetReply = `https://socialmediaclone-backend-1.onrender.com/api/comments/get-comment/${postRootId}/${startRootId}`;
    setIsLoadingReplies(true);
    try {
      const res = await authorizedAxiosInstance.get(uriGetReply);
      console.log("check 297 ", res);
      if (res.data?.result && res.data?.result.length > 0) {
        setComment((prevComments) => {
          if (!prevComments) return null;
          const updatedComments = updateReplies(
            prevComments,
            startRootId,
            res.data.result
          );
          return updatedComments;
        });
        setExpandedComments((prev) => ({ ...prev, [startRootId]: true }));
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
      toast.error("Không thể tải phản hồi!");
    } finally {
      setIsLoadingReplies(false);
    }
  };

  const isRepliesVisible = expandedComments[cmt._id] || false;

  return (
    <div className="p-2 flex gap-2">
      <div className="ava w-8 h-8 flex flex-col">
        <div className="rounded-full">
          <img
            className="w-8 h-8 rounded-full cursor-pointer object-cover"
            src={
              cmt.user?.image || // Kiểm tra cmt.user trước khi truy cập image
              "https://social-network-clone.s3.ap-southeast-1.amazonaws.com/avatar-macdinh.jpg"
            }
            alt="avatar image"
          />
        </div>
      </div>

      <div className="info flex flex-col gap-1 w-full">
        <div className="box-info bg-[#333334] p-2 rounded-2xl max-w-full break-words">
          <span className="font-bold cursor-pointer">
            {cmt.user?.username || "Unknown User"}{" "}
            {/* Kiểm tra cmt.user.username */}
          </span>
          <p className="font-extralight">{cmt.content}</p>
        </div>
        <div className="reply text-xs flex justify-start gap-3">
          <span>{getRelativeTime(cmt.created_at)}</span>
          <span className="cursor-pointer">Thích</span>
          <span onClick={handleReply} className="cursor-pointer">
            Phản hồi
          </span>
        </div>
        {!isRepliesVisible && cmt.replyCount > 0 && (
          <div
            className="reply-count cursor-pointer text-[#b0b3b8] text-sm"
            onClick={() =>
              handleGetReply({
                postRootId: cmt.postRootId,
                startRootId: cmt._id,
              })
            }
          >
            {isLoadingReplies
              ? "Đang tải..."
              : `Xem tất cả ${cmt.replyCount} phản hồi`}
          </div>
        )}

        {isReply && (
          <div className="flex items-end flex-col gap-2 mt-1">
            <input
              type="text"
              value={inputValue}
              placeholder={`Trả lời ${cmt.user?.username || "Unknown User"}...`}
              onChange={(e) => setInputValue(e.target.value)}
              className="outline-none bg-[#333334] text-[#e2e5e9] font-extralight w-[90%] py-3 px-2 rounded-xl border-[1px] border-[#46484b]"
            />
            <div className="flex gap-5 text-xs">
              <button onClick={() => setIsReply(false)}>Thoát</button>
              <button onClick={handleSubmitReply}>Trả lời</button>
            </div>
          </div>
        )}

        {isRepliesVisible && cmt.replies && cmt.replies.length > 0 && (
          <div className="ml-10 mt-2 flex flex-col gap-2">
            {cmt.replies.map((reply) => (
              <CommentItem
                key={reply._id}
                cmt={reply}
                getRelativeTime={getRelativeTime}
                setComment={setComment}
                userRootId={userRootId}
                fetchComments={fetchComments}
                expandedComments={expandedComments}
                setExpandedComments={setExpandedComments}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
