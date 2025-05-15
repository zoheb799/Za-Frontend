import React from "react";

export default function Document({
    incoming,
    author,
    timestamp,
    content,
    document,
}) {
    return (
        <div
            className={`flex flex-col md:max-w-sm max-w-105 text-white p-3 rounded-2xl ${
                incoming ? "" : "ml-auto"
            }`}
        >
            {incoming && (
                <p className="text-sm font-medium text-gray-700">{author}</p>
            )}
            <div className="relative text-black px-4 py-3 rounded-2xl rounded-tl-none space-y-2 shadow-md">
                <a href={String(document.url)} target="_blank">
                    <div className="flex flex-row  items-center justify-between p-2 bg-gray-200 rounded-md text-primary">
                        <div className="flex flex-row items-center space-x-3">
                            <div className="p-2 rounded-md bg-primary/20 text-primary">
                                <i className="pi pi-file"></i>
                            </div>
                            <div className="flex flex-col">
                                <div>{document.name}</div>
                                <div className="text-sm font-medium">
                                    {document.size}MB
                                </div>
                            </div>
                        </div>
                        <button className="pl-5">
                            <i className="pi pi-download"></i>
                        </button>
                    </div>

                    <p className="text-black">{content}</p>
                </a>
            </div>

            <div
                className={`flex flex-row items-center ${
                    incoming ? "" : "justify-end"
                } space-x-2`}
            >
                <p className="text-xs text-gray-700 mt-1">{timestamp}</p>
            </div>
        </div>
    );
}
