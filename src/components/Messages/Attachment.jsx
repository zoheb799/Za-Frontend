import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { ToggleDocumentModal, ToggleMediaModal } from "../../redux/fileSlice";

export default function Attachment() {
    const dispatch = useDispatch();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const trigger = useRef(null);
    const dropdown = useRef(null);

    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (
                !dropdown.current ||
                dropdown.current.contains(target) ||
                trigger.current.contains(target)
            ) {
                return;
            }
            setDropdownOpen(false);
        };

        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    }, []);

    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (dropdownOpen && keyCode === 27) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    }, [dropdownOpen]);

    return (
        <div className="relative flex">
            <button
                className="hover:text-body"
                ref={trigger}
                onClick={(e) => {
                    e.preventDefault();
                    setDropdownOpen((prev) => !prev);
                }}
            >
                <i className="pi pi-paperclip"></i>
            </button>

            <div
                ref={dropdown}
                className={`absolute right-0 -top-24 z-40 w-54 space-y-1 rounded-sm border border-stroke bg-white p-1.5 shadow-default ${
                    dropdownOpen ? "block" : "hidden"
                }`}
            >
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        dispatch(ToggleMediaModal(true));
                        setDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray"
                >
                    <i className="pi pi-image"></i>
                    Images
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        dispatch(ToggleMediaModal(true));
                        setDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray"
                >
                    <i className="pi pi-video"></i>
                    Videos
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        dispatch(ToggleDocumentModal(true));
                        setDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray "
                >
                    <i className="pi pi-file"></i>
                    Files & Documents
                </button>
            </div>
        </div>
    );
}
