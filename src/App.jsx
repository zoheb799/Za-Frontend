import { Route, Routes, useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Signin from "./components/Sign.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ProductsPage from "./components/Dashboard/products/products.jsx";
import Profile from "./components/Dashboard/Profile.jsx";
import DashboardHome from "./components/Dashboard/DashboardHome.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Messages from "./components/Dashboard/Messages.jsx";
import Unauthorized from "./pages/Unauthorisedpage.jsx";
import OfflinePage from "./components/offlinePage.jsx";
import Home from "./components/Home.jsx";
import ProtectedRoute from "./components/protectedRoute.jsx";
import RootRedirect from "./components/AutoRedirect.jsx"; // NEW IMPORT
import Singleproduct from "./components/Buyerspages/Singleproduct.jsx";
import MessageBuyerside from "./components/Buyerspages/MessagesBuyerside.jsx";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import SingleOrder from "./components/Buyerspages/SingleOrder.jsx";
import PaymentPage from "./components/Buyerspages/Paymentpage.jsx";
import OrdersBuyerPage from "./components/Buyerspages/Orders.jsx";
import OrdersPage from "./components/Dashboard/orders/orders.jsx";
import "./index.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useDispatch } from "react-redux";
import { fetchProducts } from "./redux/productSlice.js";



function App() {
	const location = useLocation();
	const [isOnline, setIsOnline] = useState(navigator.onLine);
	const dispatch = useDispatch();


	const privateRoutes = [
		"/dashboard",
		"/dashboard/product",
		"/dashboard/orders",
		"/dashboard/profile",
		"/unauthorized",
		"/login"
	];

	useEffect(() => {
	  dispatch(fetchProducts());
	}, [dispatch]);
	const isPrivateRoute = privateRoutes.some((route) =>
		location.pathname.startsWith(route)
	);

	useEffect(() => {
		const updateOnlineStatus = () => setIsOnline(navigator.onLine);

		window.addEventListener("online", updateOnlineStatus);
		window.addEventListener("offline", updateOnlineStatus);

		return () => {
			window.removeEventListener("online", updateOnlineStatus);
			window.removeEventListener("offline", updateOnlineStatus);
		};
	}, []);

	if (!isOnline) {
		return <OfflinePage />;
	}
	const stripePromise = loadStripe(
		"pk_test_51ROwjB2KK7CnCn5sCyiHOFadTw8yXLxdAtHjeFfWk5Vbm3pdMiwgThUhGbQnWAagv2TtZudu3EpeDXo5LuSNIxEj00UUhlJPqE"
	);
	return (
		<>
			{!isPrivateRoute && <Navbar />}
			<Routes>
				<Route path="/" element={<RootRedirect />} /> {/* updated */}
				<Route path="/login" element={<Signin />} />
				<Route path="/unauthorized" element={<Unauthorized />} />
				<Route path="/home" element={<Home />} />
				<Route path="/profile" element={<Profile />} />

				<Route path="/product/:id" element={<Singleproduct />} />
				<Route path="/product/:id" element={<Singleproduct />} />
				<Route path="/messages" element={<MessageBuyerside />} />
				<Route path="/ordersbuyer" element={<OrdersBuyerPage />} />
				<Route path="/ordersBuyer/:id" element={<SingleOrder />} />
				<Route
					path="/payment"
					element={
						<Elements stripe={stripePromise}>
							<PaymentPage />
						</Elements>
					}
				/>
				<Route
					path="/dashboard/*"
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				>
					<Route path="" element={<DashboardHome />} />
					<Route path="product" element={<ProductsPage />} />
					<Route path="orders" element={<OrdersPage />} />
					<Route path="message" element={<Messages />} />
					<Route path="profile" element={<Profile />} />
				</Route>
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
			{!isPrivateRoute && <Footer />}
		</>
	);
}

export default App;
