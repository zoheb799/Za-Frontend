import React, { useEffect, useState, useRef } from "react";
import { Sidebar } from "primereact/sidebar";
import SideNavigation from "./SideNavigation.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import GetDashBoardHeader from "./TopNavContacts.jsx";

const TopNavBar = (props) => {
    const [activePath, setActivePath] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        setActivePath(location.pathname);
    }, [location.pathname]);

    const { setActiveTab, maximizeSideBar, setMaximizeSideBar } = props;
    const [visible, setVisible] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const dropdownRef = useRef(null); // Ref for dropdown

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowOptions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className=" max-h-[85px] h-[85px] max-w-[100vw] flex justify-between border-b-2 border-gray-400 items-center px-5 py-3 sticky top-0 z-50">
            <div className="flex gap-2 items-center">
                <div className="lg:hidden mr-2 flex  items-center">
                    <i
                        className="pi pi-bars cursor-pointer text-gray-600 hover:text-blue-600"
                        style={{ fontSize: "1.5rem" }}
                        onClick={() => setVisible(true)}
                    ></i>
                </div>
                <h2 className="text-2xl font-semibold">
                    <GetDashBoardHeader activePath={activePath} />
                </h2>
            </div>
            <div
                className="flex items-center gap-5 rounded-full pr-4 pl-5 py-2 relative"
                ref={dropdownRef}
            >
                <i
                    className="pi pi-bell text-gray-600 text-xl cursor-pointer hover:text-blue-600"
                    style={{ fontSize: "1.5rem" }}
                ></i>
                <div className="w-10 h-8 flex items-center justify-center bg-gray-600 text-white rounded-full">
                    <img
                        src={currentUser?.data?.avatar}
                        className="cursor-pointer rounded-full w-[50px] h-[40px]"
                        onClick={() => setShowOptions(!showOptions)}
                    />
                    {/* Dropdown Menu */}
                    {showOptions && (
                        <div className="absolute right-10 mt-[9rem] w-[175px] border rounded-sm shadow-lg bg-white text-black">
                            <button
                                className="block w-full px-4 py-2 text-left hover:bg-gray-500 hover:text-white"
                                onClick={() => {
                                    navigate("/dashboard/profile");
                                    setShowOptions(false);
                                }}
                            >
                                Profile
                            </button>
                            <button
                                className="block px-4 py-2 text-left hover:bg-gray-500 hover:text-white"
                                onClick={() => {
                                    navigate("/dashboard/changePassword");
                                    setShowOptions(false);
                                }}
                            >
                                Change Password
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Sidebar
                visible={visible}
                onHide={() => setVisible(false)}
                content={() => (
                    <div className="relative h-full pr-1">
                        <i
                            className=" absolute top-2 right-2 text-right pi pi-times-circle text-xl cursor-pointer hover:text-blue-600"
                            onClick={() => setVisible(false)}
                            style={{ fontSize: "1.5rem" }}
                        />
                        <SideNavigation
                            activeTab={activePath}
                            setActiveTab={setActiveTab}
                            maximizeSideBar={maximizeSideBar}
                            setMaximizeSideBar={setMaximizeSideBar}
                        />
                    </div>
                )}
            ></Sidebar>
        </div>
    );
};

export default TopNavBar;
