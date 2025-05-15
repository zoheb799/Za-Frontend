import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { useDispatch, useSelector } from "react-redux";
import { signinUser, signupUser } from "../redux/userSlice";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "react-toastify";
import LOGOFOO from "../assets/svgs/logoFooter.jsx";
import svg from "../assets/sign.jpg";

const Signin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [userType, setUserType] = useState("buyer");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.user);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        if (showRegister) {
            // Handle Registration
            try {
                const payload = {
                    fullName: data.fullName,
                    email: data.email,
                    password: data.password,
                    role: userType, // 'buyer' or 'seller'
                };
    
                // Dispatch registration action
                const response = await dispatch(signupUser(payload));
    
                if (signupUser.fulfilled.match(response)) {
                    toast.success("Registered successfully! You can now sign in.");
                    setShowRegister(false); 
                } else {
                    toast.error(response?.payload?.message || "Registration failed.");
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || "Something went wrong during registration.");
                console.error("Registration error:", error);
            }
            return; 
        }
        
    
        try {
            const apiResult = await dispatch(signinUser({ ...data }));
    
            if (signinUser.fulfilled.match(apiResult)) {
                const message = apiResult.payload?.data?.message || "Login successful!";
                console.log(apiResult.payload?.data, 'apiResult');
                
                const role = apiResult.payload?.data?.role;
    
                toast.success(message);
                toast.success(role);
                console.log(role,'role');
                
                if (role === "seller") {
                    navigate("/dashboard");
                } else if (role === "buyer") {
                    navigate("/home");
                } else {
                    toast.error("Unknown user role");
                    navigate("/unauthorized");
                }
            } else {
                const errorMsg =
                    apiResult.payload?.message || "Invalid credentials or error occurred.";
                toast.error(errorMsg);
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
            console.error("Login error:", error);
        }
    };
    

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 md:pt-8">
            <div className="relative flex flex-col md:flex-row w-full md:w-[1050px] h-auto md:h-[600px] rounded-xl shadow-lg overflow-hidden border border-gray-200 mt-[-75px] mx-4 md:mx-0">
                <div className="w-full md:w-1/2 hidden md:flex items-center justify-center relative">
                    <img src={svg} alt="Signin Illustration" className="absolute w-full h-full object-cover" />
                    <div className="relative text-white p-6 mt-40">
                        <h1 className="text-5xl font-bold mb-4 px-6">
                            HyperHire  Store
                        </h1>
                        <p className="text-sm px-6">
                            E-commerce platform for all your needs. Sign up to explore a wide range of products and services tailored just for you.
                        </p>
                        <div className="text-sm text-blue-100 mt-30 px-6">
                            © {new Date().getFullYear()} Zeigler Store. All rights reserved.
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/2 flex items-center justify-center p-6">
                    <div className="w-full md:w-[470px] h-auto p-6 rounded-lg flex flex-col items-center justify-center">
                        <div className="flex justify-center mb-4">
                            <LOGOFOO className="w-40 h-20" />
                        </div>
                        <div className="group w-fit mx-auto">
                            <h2 className="text-2xl md:text-3xl font-bold text-purple-800 py-3">
                                {showRegister ? "Create an account" : "Welcome back!"}
                            </h2>
                            <hr className="w-16 border-amber-500 border-2 mb-4 transition-all duration-500 group-hover:w-full" />
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center space-y-4">
                            {showRegister && (
                                <div className="w-full md:w-4/5">
                                    <label className="block text-gray-700 text-sm font-semibold p-1">
                                        Full Name
                                    </label>
                                    <InputText
                                        {...register("fullName", { required: "Full name is required" })}
                                        className="w-full p-2 border rounded-md text-sm"
                                    />
                                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                                </div>
                            )}

                            <div className="w-full md:w-4/5">
                                <label className="block text-gray-700 text-sm font-semibold p-1">
                                    Email
                                </label>
                                <InputText
                                    type="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/,
                                            message: "Please enter a valid email",
                                        },
                                    })}
                                    className="w-full p-2 border rounded-md text-sm"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>

                            <div className="w-full md:w-4/5">
                                <label className="block text-gray-700 text-sm font-semibold p-1">
                                    Password
                                </label>
                                <div className="relative w-full">
                                    <InputText
                                        type={showPassword ? "text" : "password"}
                                        {...register("password", { required: "Password is required" })}
                                        className="w-full p-2 border rounded-md text-sm pr-10"
                                    />
                                    <i
                                        className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"} absolute right-3 top-4 cursor-pointer text-gray-500`}
                                        onClick={() => setShowPassword(!showPassword)}
                                    ></i>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                            </div>

                            {showRegister && (
                                <div className="w-full md:w-4/5 flex items-center justify-between gap-4 mt-2">
                                    <label className="text-gray-700 text-sm font-semibold">User Type:</label>
                                    <div className="flex gap-3">
                                        <div className="flex items-center">
                                            <RadioButton
                                                inputId="buyer"
                                                name="userType"
                                                value="buyer"
                                                onChange={(e) => setUserType(e.value)}
                                                checked={userType === "buyer"}
                                            />
                                            <label htmlFor="buyer" className="ml-2 text-sm">Buyer</label>
                                        </div>
                                        <div className="flex items-center">
                                            <RadioButton
                                                inputId="seller"
                                                name="userType"
                                                value="seller"
                                                onChange={(e) => setUserType(e.value)}
                                                checked={userType === "seller"}
                                            />
                                            <label htmlFor="seller" className="ml-2 text-sm">Seller</label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {loading ? (
                                <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="8" />
                            ) : (
                                <Button
                                    type="submit"
                                    label={showRegister ? "Sign Up" : "Sign In"}
                                    className="w-full md:w-4/5 p-2 bg-blue-500 text-white font-semibold text-sm rounded-md hover:bg-blue-700 transition"
                                />
                            )}
                        </form>

                        <p className="mt-4 text-sm">
                            {showRegister ? (
                                <>
                                    Already have an account?{" "}
                                    <button
                                        className="text-blue-500 hover:underline"
                                        onClick={() => setShowRegister(false)}
                                    >
                                        Sign in
                                    </button>
                                </>
                            ) : (
                                <>
                                    Don't have an account?{" "}
                                    <button
                                        className="text-blue-500 hover:underline"
                                        onClick={() => setShowRegister(true)}
                                    >
                                        Sign up
                                    </button>
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signin;
