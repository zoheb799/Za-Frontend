import React, { useEffect, useState, useCallback, useMemo } from "react";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchConversations,
    setCurrentConversation,
} from "../../redux/chatSlice.js";
import AddConversation from "./AddConversation.jsx";

export default function ChatList() {
    const dispatch = useDispatch();
    const [addConversation, setAddConversation] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const { conversations, currentConversation } = useSelector(
        (state) => state.chat
    );
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchConversations());
    }, [dispatch]);

    const debouncedSearch = useCallback(
        _.debounce((value) => {
            setSearchInput(value);
        }, 500),
        []
    );

    const handleSearchChange = (e) => {
        debouncedSearch(e.target.value);
    };

    const handleToggleConversation = () => setAddConversation((prev) => !prev);
    const handleSelectConversation = (id) =>
        dispatch(setCurrentConversation(id));

    const filteredConversations = useMemo(
        () =>
          conversations
            .map((el) => ({
              ...el,
              otherUser: el.participants.find(
                (e) => e._id !== currentUser.data._id
              ),
            }))
            .filter(({ otherUser }) =>
              otherUser?.fullName
                ?.toLowerCase()
                .includes(searchInput.toLowerCase())
            )
            .map(({ _id, otherUser, productId }) => ({
              key: _id,
              id: _id,
              name: otherUser.fullName,
              imgSrc: otherUser.avatar,
              productName: productId?.Title || "Product",  // Add product name here
              message: "",
              status: otherUser.status || "Offline",
            })),
        [conversations, searchInput, currentUser.data._id]
      );
      

    return (
        <>
            <div className="w-full max-w-sm bg-white shadow-lg  h-full overflow-hidden flex flex-col border-r-3 border-gray-200  ">
                <div className="sticky top-0 bg-white  px-6 py-4 flex justify-between items-center border-b border-gray-200 shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900 ">
                        Active Conversations
                    </h3>
                    <span className="rounded-md border border-gray-300 bg-gray-100 px-2 py-0.5 text-base font-medium text-gray-800 ">
                        {filteredConversations.length}
                    </span>
                    <button
                        onClick={handleToggleConversation}
                        aria-label="Add Conversation"
                        className="text-gray-500 hover:text-gray-700 "
                    >
                        <i className="pi pi-user-plus text-xl"></i>
                    </button>
                </div>

                <div className="flex flex-col p-5">
                    <div className="relative">
                        <input
                            placeholder="Search..."
                            type="text"
                            onChange={handleSearchChange}
                            className="w-full rounded-md border border-gray-300 py-2.5 pl-5 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-0"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                            <i className="pi pi-search"></i>
                        </button>
                    </div>

                    {filteredConversations.length === 0 ? (
                        <div className="min-h-130 flex items-center justify-center py-5">
                            <button
                                onClick={handleToggleConversation}
                                className="flex flex-row items-center space-x-2 text-blue-500 hover:underline"
                            >
                                <i className="pi pi-search"></i>
                                <span className="font-medium">
                                    Add Conversation
                                </span>
                            </button>
                        </div>
                    ) : (
                        <div className="no-scrollbar overflow-auto max-h-130 space-y-2.5 py-2">
                            {filteredConversations.map((object) => (
                                <div
                                    className={`flex cursor-pointer items-center rounded-lg px-4 py-3 transition-all shadow-md border border-gray-200  ${
                                        currentConversation === object.id
                                            ? "bg-gray-100 "
                                            : "hover:bg-gray-50"
                                    }`}
                                    key={object.key}
                                    onClick={() =>
                                        handleSelectConversation(object.id)
                                    }
                                >
                                    <div className="relative mr-3.5  overflow-hidden rounded-full  shadow-sm">
                                        {object.imgSrc ? (
                                            <div className="relative mr-3.5 h-12 w-12 rounded-full outline-0 p-0.5 shadow-md flex items-center justify-center">
                                                <img
                                                    src={object.imgSrc}
                                                    alt="profile"
                                                    className="h-full w-full rounded-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-11 w-11 flex items-center justify-center bg-gray-300 text-gray-700 text-lg font-semibold capitalize rounded-full">
                                                {object?.name.charAt(0)}
                                            </div>
                                        )}

                                        {object?.status === "Online" && (
                                            <span className="absolute bottom-1 right-0 block h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
                                        )}
                                    </div>

                                    <div className="w-full">
                                        <h5 className="text-sm font-medium text-gray-900 ">
                                            {object.name}
                                        </h5>
                                        <p className="text-xs text-gray-600 ">
                                            {object.message}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {addConversation && (
                <AddConversation
                    open={addConversation}
                    handleClose={handleToggleConversation}
                />
            )}
        </>
    );
}
