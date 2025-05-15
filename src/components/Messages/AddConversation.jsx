import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, startConversation } from "../../redux/chatSlice.js";

export default function AddConversation({ open, handleClose }) {
    const dispatch = useDispatch();
    // const { users } = useSelector((state) => state.chat);

    const { users = [] } = useSelector((store) => store.userManagement || {});

    console.log(users);

    useEffect(() => {
        if (open) {
            dispatch(fetchUsers());
        }
    }, [open, dispatch]);

    const handleStartConversation = (id) => {
        dispatch(startConversation({ userId: id }));
        handleClose();
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity ${
                open ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
        >
            <div className="w-full max-w-lg rounded-lg bg-white shadow-lg transform transition-all scale-100 p-6">
                <div className="flex items-center justify-between border-b pb-3">
                    <h2 className="text-lg font-semibold text-gray-800 ">
                        Start a Conversation
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-red-500 transition"
                    >
                        <i className="pi pi-times text-2xl"></i>
                    </button>
                </div>

                <div className="mt-4 max-h-80 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-400  scrollbar-track-gray-200 ">
                    {users?.map((user) => (
                        <div
                            key={user._id}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-300  flex items-center justify-center">
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name || "User"}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-lg font-semibold text-white uppercase">
                                            {user.name?.charAt(0) ?? "?"}
                                        </span>
                                    )}
                                </div>
                                <span className="text-gray-800  font-medium">
                                    {user.name || "Unknown User"}
                                </span>
                            </div>

                            <button
                                onClick={() =>
                                    handleStartConversation(user._id)
                                }
                                className="flex items-center space-x-2 bg-primary text-gray-500 px-3 py-2 rounded-lg hover:bg-gray-600 transition"
                            >
                                <i className="pi pi-send"></i>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
