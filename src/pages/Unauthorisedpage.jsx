import React from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import Error from "../assets/images/error.jpeg";

const Unauthorisedpage = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/dashboard");
    };

return (
        <div className="flex flex-col lg:flex-row items-center justify-between p-6 md:p-12 shadow-lg min-h-screen  border-gray-300 bg-white rounded-lg max-w-6xl mx-auto">
            <div className="w-full lg:w-1/2 flex justify-center">
                <img
                    className="max-w-full h-auto object-cover rounded-md"
                    src={Error}
                    alt="error message"
                />
            </div>

            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-4">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-800">
                    Access Denied — Authorisation Required
                </h1>
                <p className="text-base text-gray-700">
                    You do not have the necessary permissions to view this
                    content. This page is restricted, or you may have reached it
                    in error.
                </p>
                <p className="text-base text-gray-700">
                    If you believe this is a mistake, please contact the
                    administrator or return to the homepage for further
                    navigation.
                </p>
                <div className="flex justify-center lg:justify-start">
                    <Button onClick={handleClick}> Return to Dashboard </Button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorisedpage;
