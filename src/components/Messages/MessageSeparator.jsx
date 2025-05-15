import React from "react";
export default function MsgSeparator({ date }) {
    return (
        <div className="flex flex-row items-center space-x-5 w-full py-2">
            <div className="border-b border-stroke grow"></div>
            <div className="p-2 bg-gray rounded-md text-xs text-body font-medium">
                {new Date(date).toDateString()}
            </div>
            <div className="border-b border-stroke grow"></div>
        </div>
    );
}
