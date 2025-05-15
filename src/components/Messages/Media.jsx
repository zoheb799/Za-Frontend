import React from "react";
import MediaMsgGrid from "./MediaMsgGrid.jsx";

export default function Media({ incoming, author, timestamp, media, caption }) {
    return (
        <div
            className={`flex flex-col md:max-w-sm max-w-105 text-white  p-3 rounded-2xl ${
                incoming ? " " : "ml-auto"
            }`}
        >
            {incoming && (
                <p className="text-sm font-medium text-gray-700">{author}</p>
            )}

            <div
                className={`relative text-black px-4 py-3 rounded-2xl space-y-2 shadow-md bg-gray-200 ${
                    incoming ? " rounded-tl-none " : "rounded-br-none "
                }`}
            >
                <MediaMsgGrid incoming={incoming} media={media} />
                <p>{caption}</p>
            </div>

            <p
                className={`text-xs text-gray-700 mt-1 ${
                    incoming
                        ? ""
                        : "flex flex-row items-center justify-end space-x-2"
                }`}
            >
                {timestamp}
            </p>
        </div>
    );
}
