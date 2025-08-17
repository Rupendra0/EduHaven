"use client";
import { useState, useEffect } from "react";
import {
  User,
  MessageCircle,
  ThumbsUp,
  Edit3,
  Share2,
  UserPlus,
  Landmark,
  Earth,
  DraftingCompass,
  Puzzle,
} from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link, useParams } from "react-router-dom";

const backendUrl = import.meta.env.VITE_API_URL;

const ProfileCard = ({ isCurrentUser = false, profileUser }) => {
  const [user, setUser] = useState(null);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [loading, setLoading] = useState(false); // to check if Friend Request is Processing
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useParams();
  const friendId = user?._id; // Determine the profile ID

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        let response;
        if (isCurrentUser) {
          const token = localStorage.getItem("token");
          if (!token) return;

          const decoded = jwtDecode(token);
          response = await axios.get(
            `${backendUrl}/user/details?id=${decoded.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          response = await axios.get(`${backendUrl}/user/details?id=${userId}`);
        }
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [isCurrentUser, userId]);

  // Check if friend request already sent
  useEffect(() => {
    const checkFriendRequest = async () => {
      if (!user || isCurrentUser) return;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${backendUrl}/friends/sent-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;

        const sentRequests = await res.json();
        const alreadySent = sentRequests.some(
          (reqUser) => reqUser._id === user._id
        );
        setIsRequestSent(alreadySent);
      } catch (err) {
        console.error(err);
      }
    };

    checkFriendRequest();
  }, [user, isCurrentUser]);

  // Send Friend Request
  const handleSendFriendRequest = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${backendUrl}/friends/request/${friendId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        setIsRequestSent(true);
        const data = await res.json();
        console.log(data.message);
      } else {
        console.error("Failed to send request");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cancel Friend Request
  const handleCancelFriendRequest = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${backendUrl}/friends/sent-requests/${friendId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        setIsRequestSent(false);
        const data = await res.json();
        console.log(data.message);
      } else {
        console.error("Failed to cancel request");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="overflow-hidden bg-gradient-to-br from-indigo-500/50 to-purple-500/5 rounded-3xl shadow-2xl pt-6 w-full h-fit relative">
        {/* Skeleton nav */}
        <div className="flex justify-end gap-6 px-4">
          {isCurrentUser && (
            <div className="w-6 h-6 rounded-full bg-gray-400/30"></div>
          )}
          <div className="w-6 h-6 rounded-full bg-gray-400/30"></div>
        </div>

        <div className="mx-4">
          {/* Skeleton profile */}
          <div className="relative flex items-center mb-4 gap-4 ">
            <div className="shrink-0 w-28 h-28 rounded-full bg-gray-400/30"></div>
            <div className="text-center flex-1">
              <div className="h-8 w-14 mx-auto rounded-md bg-gray-400/30 mb-1 "></div>
              <div className="h-4 w-18 mx-auto rounded-sm bg-gray-400/20"></div>
            </div>
            <div className="text-center flex-1">
              <div className="h-8 w-14 mx-auto rounded-md bg-gray-400/30 mb-1"></div>
              <div className="h-4 w-18 mx-auto rounded-sm bg-gray-400/20"></div>
            </div>
          </div>

          {/* Skeleton user info */}
          <div className="mb-4">
            <div className="h-6 w-40 rounded-md bg-gray-400/30 mb-2"></div>
            <div className="h-4 w-64 rounded-sm bg-gray-400/20"></div>
          </div>

          {/* Skeleton buttons */}
          <div className="flex flex-wrap justify-center gap-4 my-4">
            <div className="h-10 rounded-lg bg-gray-400/30 flex-1"></div>
            <div className="h-10 rounded-lg bg-gray-400/30 flex-1"></div>
            <div className="h-10 rounded-lg bg-gray-400/30 w-full"></div>
          </div>
        </div>

        {/* Skeleton details */}
        <div className="bg-gray-500/20 rounded-3xl p-4 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-7 w-7 rounded-full bg-gray-400/30"></div>
              <div className="flex-1">
                <div className="h-3 w-16 rounded-sm bg-gray-400/20 mb-1"></div>
                <div className="h-5 w-32 rounded-md bg-gray-400/30"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-500/50 to-purple-500/5 rounded-3xl shadow-2xl pt-6 w-full h-fit relative overflow-hidden">
      {/* nav */}
      <div className="flex justify-end gap-6 px-4">
        {isCurrentUser && (
          <Link to={"/settings/"}>
            <Edit3 className="h-6 w-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" />
          </Link>
        )}
        <Share2 className="h-6 w-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" />
      </div>

      <div className="mx-4">
        {/* Profile  */}
        <div className="relative flex items-center mb-4 gap-4">
          <div className="w-28 h-28 rounded-full shadow-lg overflow-hidden">
            {user.ProfilePicture ? (
              <img
                src={user.ProfilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-indigo-600/50 flex items-center justify-center">
                <User className="w-16 h-16 text-white/70" />
              </div>
            )}
          </div>
          <div className="text-center flex-1">
            <span className="block text-2xl font-bold text-[var(--text-primary)]">
              342
            </span>
            <span className="text-sm text-[var(--text-secondary)]">Kudos</span>
          </div>
          <div className="text-center flex-1">
            <span className="block text-2xl font-bold text-[var(--text-primary)]">
              56
            </span>
            <span className="text-sm text-[var(--text-secondary)]">
              Friends
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="text-[var(--text-primary)]">
          <h2 className="text-xl font-bold">
            {user.FirstName} {user.LastName}
          </h2>
          {user?.Bio && (
            <p className="text-[var(--text-secondary)] mb-4 max-w-xs">
              {user.Bio}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 my-4">
          <button className="bg-white/20 hover:bg-white/30 transition-colors text-[var(--text-primary)] px-6 py-2 h-10 rounded-lg flex items-center space-x-2 flex-1">
            <ThumbsUp className="w-5 h-5" />
            <span>Kudos</span>
          </button>
          <button className="bg-white/20 hover:bg-white/30 transition-colors text-[var(--text-primary)] px-6 py-2 h-10 rounded-lg flex items-center space-x-2 flex-1">
            <MessageCircle className="w-5 h-5" />
            <span>Chat</span>
          </button>
          {!isCurrentUser && (
            <>
              {isRequestSent === false && (
                <button
                  onClick={handleSendFriendRequest}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 transition-colors text-white px-6 py-2 h-10 rounded-lg flex items-center space-x-2 flex-1 text-nowrap"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>{loading ? "Sending..." : "Add Friend"}</span>
                </button>
              )}

              {isRequestSent === true && (
                <button
                  onClick={handleCancelFriendRequest}
                  disabled={loading}
                  className="bg-white/20 hover:bg-white/30 transition-colors text-[var(--text-primary)] px-6 py-2 h-10 rounded-lg flex items-center space-x-2 flex-1 text-nowrap"
                >
                  <span>{loading ? "Cancelling..." : "Cancel Request"}</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Additional Details */}
      <div className="bg-gray-500/20 rounded-3xl p-4 space-y-4">
        {user.FieldOfStudy && (
          <div className="flex items-center gap-4 text-[var(--text-secondary)]">
            <Landmark className="h-7 w-7" />
            <div>
              <p className="text-xs">{user.University || "Field of Study"}</p>
              <p className="text-lg text-[var(--text-primary)]">
                {user.FieldOfStudy}
                {", " + user.GraduationYear || ""}
              </p>
            </div>
          </div>
        )}

        {user.OtherDetails?.skills && (
          <div className="flex items-center gap-4 text-[var(--text-secondary)]">
            <Puzzle className="h-7 w-7" />
            <div>
              <p className="text-xs">Skills</p>
              <p className="text-lg text-[var(--text-primary)]">
                {user.OtherDetails.skills}
              </p>
            </div>
          </div>
        )}
        {user.OtherDetails?.interests && (
          <div className="flex items-center gap-4 text-[var(--text-secondary)]">
            <DraftingCompass className="h-7 w-7" />
            <div>
              <p className="text-xs">Interests</p>
              <p className="text-lg text-[var(--text-primary)]">
                {user.OtherDetails.interests}
              </p>
            </div>
          </div>
        )}
        {user.Country && (
          <div className="flex items-center gap-4 text-[var(--text-secondary)]">
            <Earth className="h-7 w-7" />
            <div>
              <p className="text-xs">Country</p>
              <p className="text-lg text-[var(--text-primary)]">
                {user.Country}
              </p>
            </div>
          </div>
        )}
        {user.OtherDetails?.additionalNotes && (
          <div className="flex gap-3 text-[var(--text-secondary)]">
            <span>{user.OtherDetails.additionalNotes}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
