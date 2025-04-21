/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import authorizedAxiosInstance from "../utils/authorizedAxios";
import { AxiosError } from "axios";
interface FollowingUser {
  id: string;
  username: string;
  image: string;
}

interface FollowData {
  id: string;
  created_at: string;
  followingUser: FollowingUser;
}

interface ListFriendProps {
  onUserClick: (user: FollowingUser) => void;
}

export const ListFriend: FC<ListFriendProps> = ({ onUserClick }) => {
  const [following, setFollowing] = useState<FollowData[]>([]);
  console.log("check 39 ", following);

  useEffect(() => {
    const getListFollowing = async () => {
      try {
        const res = await authorizedAxiosInstance.get(
          "https://socialmediaclone-backend-1.onrender.com/api/user/get-list-follow"
        );

        if (res.status == 200 || res.status == 201) {
          setFollowing(res.data.data);
        }
      } catch (error) {
        console.log("check log 36 ", error);
        const newErr = error as AxiosError;
        console.log(newErr.message);
      }
    };
    getListFollowing();
  }, []);

  return (
    <div className="list-friend">
      {following.map((friend) => (
        <div
          key={friend.id}
          className="friend-item cursor-pointer flex items-center  p-3  my-3 mx-2 rounded-xl hover:bg-[#5b708366] duration-200"
          onClick={() => onUserClick(friend.followingUser)}
        >
          <div className="ava">
            <img src={friend.followingUser.image} alt="" />
          </div>
          <div className="name text-white">{friend.followingUser.username}</div>
        </div>
      ))}
    </div>
  );
};
