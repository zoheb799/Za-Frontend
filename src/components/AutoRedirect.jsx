import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RootRedirect = () => {
    const { currentUser } = useSelector((store) => store.user);

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    const role = currentUser?.data?.role;

    if (role === "seller") {
        return <Navigate to="/dashboard" />;
    } else {
        return <Navigate to="/home" />;
    }
};

export default RootRedirect;
