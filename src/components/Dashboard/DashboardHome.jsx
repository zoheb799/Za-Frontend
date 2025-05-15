import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "primereact/skeleton";
import DashboardOrderList from "./NestedDashboardComponents/DashboardOrderList.jsx";
import DashboardProductList from "./NestedDashboardComponents/DashboardProductList.jsx";
import { fetchAllOrders } from "../../redux/orderSlice.js";
import { fetchMyProducts } from "../../redux/productSlice.js";

const DashboardHome = () => {
	const [time, setTime] = useState(new Date());
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state) => state.user);

	const orderlists = useSelector(
		(state) => state.orders.orderlists.orders || []
	);
	const productlists = useSelector((state) => state.product.myItems || []);
	const loadingOrderStatus = useSelector(
		(state) => state.orders.status === "loading"
	);
	const loadingProductStatus = useSelector(
		(state) => state.product.status === "loading"
	);

	const [ordersReceived, setOrdersReceived] = useState(0);
	const [productsMade, setProductsMade] = useState(0);
	const [paymentReceived, setPaymentReceived] = useState(0);

	// Clock
	useEffect(() => {
		const interval = setInterval(() => {
			setTime(new Date());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	// Fetch orders and products
	useEffect(() => {
		dispatch(fetchAllOrders());
		dispatch(fetchMyProducts());
	}, [dispatch]);

	// Count orders/products/payments
	useEffect(() => {
		setOrdersReceived(orderlists.length || 0);
		setProductsMade(productlists.length || 0);
		setPaymentReceived(2983); // Replace with dynamic calculation if needed
	}, [orderlists, productlists]);

	return (
		<div className="flex flex-col min-h-screen bg-gray-100">
			{/* Welcome + Clock */}
			<div className="flex flex-wrap items-center justify-between bg-white shadow-md rounded-lg px-6 py-3 m-4">
				<h2 className="text-lg font-semibold">
					Welcome {currentUser?.data?.fullName}
				</h2>
				<div className="text-right">
					<div className="text-base font-medium">
						{time.toLocaleTimeString("en-US", {
							hour: "2-digit",
							minute: "2-digit",
							second: "2-digit",
							hour12: true,
						})}
					</div>
					<div className="text-sm text-gray-500">
						{time.toLocaleDateString("en-US", { weekday: "long" })}
					</div>
				</div>
			</div>

			{/* Top Summary Cards */}
			<div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-center items-center">
					<h3 className="text-lg font-semibold">Orders Received</h3>
					<p className="text-2xl">{ordersReceived}</p>
				</div>
				<div className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-center items-center">
					<h3 className="text-lg font-semibold">Products Made</h3>
					<p className="text-2xl">{productsMade}</p>
				</div>
				<div className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-center items-center">
					<h3 className="text-lg font-semibold">Payment Figure</h3>
					<p className="text-2xl">₹{paymentReceived}</p>
				</div>
			</div>

			{/* Bottom Section - Order and Product Lists */}
			<div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Orders */}
				<div className="bg-white rounded-lg shadow-md p-4">
					<h3 className="text-lg font-semibold mb-2">
						Latest Orders
					</h3>
					{loadingOrderStatus ? (
						<div className="space-y-4">
							{Array.from({ length: 4 }).map((_, i) => (
								<div
									key={i}
									className="flex justify-between items-center"
								>
									<Skeleton width="20%" height="1.5rem" />
									<Skeleton width="30%" height="1.5rem" />
									<Skeleton width="25%" height="1.5rem" />
									<Skeleton width="15%" height="1.5rem" />
								</div>
							))}
						</div>
					) : (
						<DashboardOrderList orders={orderlists} />
					)}
				</div>

				{/* Products */}
				<div className="bg-white rounded-lg shadow-md p-4">
					<h3 className="text-lg font-semibold mb-2">My Products</h3>
					{loadingProductStatus ? (
						<div className="space-y-4">
							{Array.from({ length: 4 }).map((_, i) => (
								<div
									key={i}
									className="flex justify-between items-center"
								>
									<Skeleton width="30%" height="1.5rem" />
									<Skeleton width="25%" height="1.5rem" />
									<Skeleton width="25%" height="1.5rem" />
									<Skeleton width="10%" height="1.5rem" />
								</div>
							))}
						</div>
					) : (
						<DashboardProductList products={productlists} />
					)}
				</div>
			</div>
		</div>
	);
};

export default DashboardHome;
