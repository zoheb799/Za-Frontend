import React from "react";
import moment from "moment";

const DashboardOrderList = ({ orders }) => {
    return (
        <div className="pt-4 px-4 min-h-80">
            <div className="border-b-2 border-gray-200 pb-2">
                <div className="flex justify-between font-semibold text-lg mt-3 px-3">
                    <p className="w-16">S.No</p>
                    <p className="flex-1 min-w-[120px]">Buyer</p>
                    <p className="flex-1 min-w-[150px]">Product</p>
                    <p className="w-28 text-center">Amount</p>
                    <p className="w-32 text-center">Status</p>
                    <p className="w-36 text-center">Date</p>
                </div>
            </div>

            <div className="border-gray-200 rounded-md mt-2">
                {orders && orders.length > 0 ? (
                    orders.map((order, index) => (
                        <div
                            key={order._id}
                            className="flex justify-between text-[0.9rem] items-center text-gray-600 py-4 border-b-1 border-gray-200 px-3"
                        >
                            <p className="w-16 truncate pr-4">{index + 1}</p>
                            <p className="flex-1 min-w-[120px] truncate pr-4">
                                {order?.buyer?.fullName || "—"}
                            </p>
                            <p className="flex-1 min-w-[150px] truncate pr-4">
                                {order?.product?.title || "—"}
                            </p>
                            <p className="w-28 text-center">
                                ₹{(order?.payment?.amount / 100).toFixed(2)}
                            </p>
                            <p className="w-32 text-center">
                                {order?.status || "—"}
                            </p>
                            <p className="w-36 text-center">
                                {moment(order?.createdAt).format("DD-MM-YYYY")}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500 text-center py-8">
                        No orders found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardOrderList;
