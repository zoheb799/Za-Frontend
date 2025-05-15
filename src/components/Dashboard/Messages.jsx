import React, { useEffect, useState } from "react";
import ChatList from "../Messages/ChatList.jsx";
import MessagesInbox from "../Messages/MessagesInbox.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { connectWithSocketServer } from "../../socket/socketConnection.js";
import {
    updateUserStatus,
    addMessage,
    replaceChatHistory,
} from "../../redux/chatSlice.js";
import axios from "axios";
import { toast } from "react-toastify";

function Messages() {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const location = useLocation();
    const { sellerId, productId } = location.state || {};

    const isLoggedIn = currentUser?.success;
    const token = currentUser?.data?.accessToken;

    useEffect(() => {
        let socket;
        if (isLoggedIn) {
            socket = connectWithSocketServer({ token });

            socket.on("connect", () => {
                console.log("Connected to socket.io");
            });

            socket.on("user-disconnected", (data) => {
                dispatch(updateUserStatus({ userId: data.userId, status: data.status }));
            });

            socket.on("user-connected", (data) => {
                dispatch(updateUserStatus({ userId: data.userId, status: data.status }));
            });

            socket.on("chat-history", (data) => {
                dispatch(replaceChatHistory(data));
            });

            socket.on("new-direct-chat", (data) => {
                dispatch(addMessage(data));
            });
        }

        return () => {
            if (socket) {
                socket.disconnect();
                socket.off();
            }
        };
    }, [isLoggedIn, token]);

    // 👉 Call openChat when sellerId and productId are passed from navigation
    useEffect(() => {
        const startConversation = async () => {
            if (sellerId && productId && token) {
                try {
                    const res = await axios.post(
                        "/api/v1//message/open-chat",
                        { sellerId, productId },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    toast.success("Chat opened/created successfully");
                    console.log("Chat opened/created:", res.data);
                } catch (err) {
                    toast.error("Error opening/creating chat", err);
                    console.error("Error starting chat:", err);
                }
            }
        };

        startConversation();
    }, [sellerId, productId, token]);

    return (
        <div className="flex h-full border-b-2">
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
