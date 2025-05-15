import React from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const DashboardProductList = ({ products }) => {
    const navigate = useNavigate();

    return (
        <div className="pt-4 px-4 bg-white rounded-md min-h-96">
            <div className="border-b-2 border-gray-300 pb-2">
                <h2 className="font-bold text-xl">My Products</h2>
                <div className="flex justify-between font-semibold text-lg mt-3 px-3">
                    <p className="w-20 pr-4">Product ID</p>
                    <p className="flex-1 min-w-[150px] pr-4">Title</p>
                    <p className="w-24 pr-4">Price</p>
                    <p className="w-24 pr-4">Stock</p>
                    <p className="w-28 pr-4">Status</p>
                    <p className="w-36">Created At</p>
                </div>
            </div>

            {products && products.length > 0 ? (
                <div className="overflow-y-auto max-h-80 border-gray-200 mt-2 rounded-md">
                    {products.map((product, index) => (
                        <div
                            key={product._id}
                            className="flex justify-between items-center text-[0.9rem] text-gray-600 px-3 py-4 border-b-1 border-gray-200"
                        >
                            <span
                                className="cursor-pointer"
                                onClick={() =>
                                    navigate(`/dashboard/product/${product._id}`, {
                                        state: product,
                                    })
                                }
                            >
                                <p className="w-20 truncate pr-4">{product._id.slice(-6)}</p>
                            </span>
                            <p className="flex-1 min-w-[150px] truncate pr-4">
                                {product?.title}
                            </p>
                            <p className="w-24 pr-4">₹{product?.price}</p>
                            <p className="w-24 pr-4">{product?.stock}</p>
                            <p className="w-28 pr-4">{product?.status}</p>
                            <p className="w-36">
                                {moment(product?.createdAt).format("DD-MM-YYYY")}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center h-40 text-gray-500">
                    - No Products Found -
                </div>
            )}
        </div>
    );
};

export default DashboardProductList;
