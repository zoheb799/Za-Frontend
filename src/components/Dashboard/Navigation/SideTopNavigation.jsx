import React, { useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutUser } from "../../../redux/userSlice";
import {toast} from "react-toastify";
const SideTopNavigation = (props) => {
    const { ProfileData, maximizeSideBar, setMaximizeSideBar } = props;
    const navigate = useNavigate();
    const op = useRef(null);
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();
    const { currentUser } = useSelector((store) => store.user);
    const userrole = currentUser?.data?.role;

    const handleOnLogout = async () => {
        const apiResult = await dispatch(signOutUser());
        if (signOutUser.fulfilled.match(apiResult)) {
            navigate("/login");
            toast.success("Signed Out Successfully!");
        }
    };

    const handleOnEditProfile = () => {
        navigate("/dashboard/profile");
    };

    const toggleMaximizeSideBar = () => {
        setMaximizeSideBar((prev) => !prev);
    };


    return (
        <div className=" flex px-5 py-3 items-center max-h-[85px] h-[85px] text-gray-900 border-b-2 border-gray-400 ">
            <div className=" w-full h-[100px] flex justify-between items-center">
                {maximizeSideBar && (
                    <div>
                        <h2 className="text-xl font-bold ">
                            ZA E-Commerce
                            <i
                                className="pi pi-angle-down hover:text-blue-600 cursor-pointer ml-2"
                                onClick={(e) => op.current.toggle(e)}
                            ></i>
                        </h2>
                        <p className="overflow-hidden text-ellipsis ">
                            {ProfileData?.name}
                        </p>
                    </div>
                )}
                <div className="hidden lg:inline">
                    <i
                        className={` pi ${
                            maximizeSideBar
                                ? "pi-angle-double-left"
                                : "pi-angle-double-right"
                        } text-gray-600 hover:text-blue-600 cursor-pointer `}
                        style={{ fontSize: "1.5rem" }}
                        onClick={() => toggleMaximizeSideBar()}
                    ></i>
                </div>
            </div>
            <OverlayPanel ref={op} showCloseIcon>
                <div className="w-[300px]">
                    <div
                        className="flex gap-2 items-center justify-between p-4 hover:bg-blue-400 w-full "
                        onClick={handleOnEditProfile}
                    >
                        <div className="flex gap-3 items-center">
                            <img
                                src={ProfileData?.avatar}
                                className="w-[40px] h-[40px]"
                            />
                            <div>
                                <h2 className="font-bold text-ellipsis">
                                    {ProfileData.name}
                                </h2>
                                <p className="text-ellipsis">
                                    {ProfileData.designation}
                                </p>
                            </div>
                        </div>
                        <i
                            className="pi pi-pen-to-square hover:text-blue-600 cursor-pointer"
                            style={{ fontSize: "20px" }}
                        ></i>
                    </div>

                    <div
                        className=" w-full flex gap-2 p-2 px-4 text-gray-500 hover:text-blue-900 hover:bg-blue-400 cursor-pointer "
                        onClick={handleOnLogout}
                    >
                        <button
                            className={`w-full text-left font-semibold transition duration-200 cursor-pointer`}
                        >
                            Logout
                        </button>
                        <i
                            className={`ml-3 pi pi-sign-out`}
                            style={{ fontSize: "20px" }}
                        ></i>
                    </div>
                </div>
            </OverlayPanel>
        </div>
    );
};
export default SideTopNavigation;
