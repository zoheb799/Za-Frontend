import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
    const { currentUser } = useSelector((store) => store.user);
    const location = useLocation();

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    const role = currentUser?.user?.role;

    if (role === "buyer" && location.pathname.startsWith("/dashboard")) {
        return <Navigate to="/home" />;
    }

    return children;
};

export default ProtectedRoute;
