import React, { useEffect, useState } from "react";
import axios from "../../api/axios.js";
import { Tag } from "primereact/tag";
import { Rating } from "primereact/rating";
import { Skeleton } from "primereact/skeleton";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";



const OrdersBuyerPage = () => {
  
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);
	const { currentUser } = useSelector((state) => state.user);
	const navigate = useNavigate();

	const userId = currentUser?.data?._id;

	useEffect(() => {
		const fetchOrders = async () => {
			setLoading(true);
			try {
				const res = await axios.get("/api/v1/orders/my-orders");
				setOrders(res.data.message.orders);
			} catch (error) {
				console.error("Error fetching orders:", error);
			}
			setLoading(false);
		};
		if (userId) fetchOrders();
	}, [userId]);

	const onOrderClick = (order) => {
		navigate(`/ordersBuyer/${order._id}`, { state: { order } });
	};

	const renderSkeletonCard = (count = 6) =>
		Array.from({ length: count }).map((_, idx) => (
			<div
				key={idx}
				className="bg-white rounded-lg shadow p-4 flex flex-col"
			>
				<Skeleton className="w-full h-40 mb-4" />
				<Skeleton width="60%" className="mb-2" />
				<Skeleton width="80%" className="mb-2" />
				<Skeleton width="40%" className="mb-2" />
				<Skeleton width="50%" className="mb-2" />
				<Skeleton width="70%" className="mb-2" />
				<div className="flex justify-between mt-auto pt-4">
					<Skeleton width="30%" height="1.5rem" />
					<Skeleton width="20%" height="1.5rem" />
				</div>
			</div>
		));

	return (
		<div className="pt-24 px-4 min-h-screen bg-gray-50">
			<h2 className="text-2xl font-semibold text-center mb-6">
				Your Orders
			</h2>

			<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				{loading
					? renderSkeletonCard(6)
					: orders.map((order) => {
							const { product, sellerName } = order;
							if (!product) return null;

							return (
								<div
									key={order._id}
									onClick={() => onOrderClick(order)}
									className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer p-4 flex flex-col"
								>
									<img
										src={
											product.images?.[0] ||
											"https://via.placeholder.com/150"
										}
										alt={product.title}
										className="w-full h-40 object-contain mb-4"
									/>

									<h3 className="text-lg font-semibold">
										{product.title}
									</h3>
									<p className="text-sm text-gray-600 line-clamp-2">
										{product.description}
									</p>

									<div className="flex items-center mt-2">
										<Rating
											value={product.rating || 0}
											readOnly
											cancel={false}
											className="text-sm"
										/>
									</div>

									<div className="text-sm text-gray-500 mt-2">
										Category: {product.category || "N/A"}
									</div>
									<div className="text-sm text-gray-700 font-medium mt-1">
										Seller: {sellerName || "Unknown"}
									</div>

									<div className="mt-auto flex justify-between items-center pt-4">
										<span className="text-xl font-bold text-blue-600">
											₹{product.price}
										</span>
										{product.inStock ? (
											<Tag
												value="INSTOCK"
												severity="success"
											/>
										) : (
											<Tag
												value="LOWSTOCK"
												severity="warning"
											/>
										)}
									</div>
								</div>
							);
					  })}
			</div>
		</div>
	);
};

export default OrdersBuyerPage;
