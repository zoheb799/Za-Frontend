import React, { useEffect } from "react";
import ChatList from "../Messages/ChatList.jsx";
import MessagesInbox from "../Messages/MessagesInbox.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { connectWithSocketServer } from "../../socket/socketConnection.js";
import {
  updateUserStatus,
  addMessage,
  replaceChatHistory,
  setCurrentConversation,
} from "../../redux/chatSlice.js";
import axios from "axios";

function Messages() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { sellerId, productId,productName } = useLocation().state || {};
  console.log(productName,'name');
  
  const isLoggedIn = currentUser?.success;
  const token = currentUser?.data?.accessToken;

  // 📩 Start conversation if navigated from product page
  useEffect(() => {
    const initiateConversation = async () => {
      if (sellerId && productId && productName && token) {
        try {
          // Replace the startConversation dispatch with axios
          const res = await axios.post(
            "/api/v1/message/open-chat",
            { sellerId, productId, productName },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const conversation = res.data.data.conversation;

          // ✅ Add the conversation to Redux store manually
          dispatch(setCurrentConversation(conversation._id));

        } catch (error) {
          console.error("Error initiating conversation:", error);
        }
      }
    };

    initiateConversation();
  }, [sellerId, productId, token, dispatch]);

  // 🔌 Setup socket connection and listeners
  useEffect(() => {
    if (!isLoggedIn || !token) return;

    const socket = connectWithSocketServer({ token });

    socket.on("connect", () => console.log("✅ Socket connected"));

    socket.on("user-connected", (data) => {
      dispatch(updateUserStatus({ userId: data.userId, status: "online" }));
    });

    socket.on("user-disconnected", (data) => {
      dispatch(updateUserStatus({ userId: data.userId, status: "offline" }));
    });

    socket.on("chat-history", (data) => {
      dispatch(replaceChatHistory(data));
    });

    socket.on("new-direct-chat", (data) => {
      dispatch(addMessage(data));
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [isLoggedIn, token, dispatch]);

  return (
    <div className="min-h-screen flex h-full border-b-2 pt-24">
      <div className="w-1/3">
        <ChatList />
      </div>
      <div className="w-full">
        <MessagesInbox />
      </div>
    </div>
  );
}

export default Messages;
