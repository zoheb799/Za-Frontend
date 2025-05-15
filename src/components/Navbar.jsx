import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "primeicons/primeicons.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { signOutUser } from "../redux/userSlice";
import { fetchConversations } from "../redux/chatSlice";
import { searchProducts } from "../redux/productSlice";
import LOGOFOO from "../assets/svgs/logoFooter";

const Navbar = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const [cartOpen, setCartOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [scrolling, setScrolling] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [showDropdown, setShowDropdown] = useState(false);

	const inputRef = useRef(null);
	const dropdownRef = useRef(null);

	const { currentUser } = useSelector((store) => store.user);
	const { conversations } = useSelector((store) => store.chat);
	const { filtered } = useSelector((state) => state.product || { filtered: [] });

	console.log(filtered);
	

	const cartItems = currentUser?.data.cart || [];
	const currentUserId = currentUser?.data?._id;

	const unreadCount = conversations.reduce((acc, conv) => {
		const unreadMessages = (conv.messages || []).filter(
			(msg) =>
				!msg.seenBy?.includes(currentUserId) &&
				msg.sender !== currentUserId
		);
		return acc + unreadMessages.length;
	}, 0);

	const navbarRef = useRef(null);
	const menuRef = useRef(null);
	const cartRef = useRef(null);

	useEffect(() => {
		dispatch(fetchConversations());
	}, [dispatch]);

	useEffect(() => {
		setMenuOpen(false);
	}, [location]);

	useEffect(() => {
		const handleScroll = () => setScrolling(window.scrollY > 1);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		const handleClickOutside = (event) => {
			// Close menu if clicked outside and not on the button
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target) &&
				!event.target.closest(".user-button")
			) {
				setMenuOpen(false);
			}
			// Close cart if clicked outside and not on the cart icon
			if (
				cartRef.current &&
				!cartRef.current.contains(event.target) &&
				!event.target.closest(".cart-button")
			) {
				setCartOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		document.body.style.overflow = cartOpen ? "hidden" : "auto";
	}, [cartOpen]);

	const handleLogout = () => {
		dispatch(signOutUser());
		navigate("/login");
		toast.success("You have logged out successfully.");
	};

	const handleLoginClick = () => {
		window.scrollTo(0, 0);
		navigate("/login");
	};

	const updateQuantity = async (productId, newQuantity) => {
		try {
			await axios.put(`/api/v1/product/cart/update/${productId}`, {
				quantity: newQuantity,
			});
		} catch (err) {
			console.error("Failed to update quantity", err);
			toast.error("Failed to update quantity");
		}
	};

	const handleremove = async () => {
		try {
			await axios.delete(`/api/v1/product/clear`);
			toast.success("All items removed from cart");
		} catch (err) {
			console.error("Failed to remove all items", err);
			toast.error("Failed to remove all items");
		}
	};

	const handleSearchChange = (e) => {
		const keyword = e.target.value;
		setSearchTerm(keyword);
		dispatch(searchProducts(keyword));
		setShowDropdown(keyword.trim() !== "");
	};

	const handleProductClick = (id) => {
		navigate(`/product/${id}`);
		setSearchTerm("");
		setShowDropdown(false);
	};

	return (
		<nav
			ref={navbarRef}
			className={`fixed top-0 left-0 w-full p-4 z-50 transition-all duration-300 ${
				scrolling ? "bg-white shadow-md" : "bg-white"
			}`}
		>
			<div className="container mx-auto flex justify-between items-center px-4 md:px-8">
				<Link to="/" className="text-2xl font-bold text-blue-600">
				<LOGOFOO />
				</Link>
				<div className="relative flex-grow px-4">
					<input
						ref={inputRef}
						type="text"
						value={searchTerm}
						onChange={handleSearchChange}
						placeholder="Search for Products, Brands and More"
						className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					{showDropdown && (
						<div
							ref={dropdownRef}
							className="absolute bg-white shadow-lg rounded-md mt-1 max-h-64 overflow-y-auto w-full z-50"
						>
							{filtered.length > 0 ? (
								filtered.map((product) => (
									<div
										key={product._id}
										className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
										onClick={() =>
											handleProductClick(product._id)
										}
									>
										<img
											src={
												product.images?.[0] ||
												"https://via.placeholder.com/40"
											}
											alt={product.title}
											className="w-10 h-10 object-cover rounded"
										/>
										<span className="text-sm">
											{product.title}
										</span>
									</div>
								))
							) : (
								<p className="text-sm text-gray-500 px-4 py-2">
									No products found.
								</p>
							)}
						</div>
					)}
				</div>

				<div className="flex items-center space-x-4">
					{/* Messages */}
					<Link
						to="/messages"
						className="relative text-2xl text-blue-600"
						title="Messages"
					>
						<i className="pi pi-inbox" />
						{unreadCount > 0 && (
							<span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-1">
								{unreadCount}
							</span>
						)}
					</Link>

					{/* Orders */}
					<Link
						to="/ordersbuyer"
						className="text-2xl text-blue-600"
						title="My Orders"
					>
						<i className="pi pi-shopping-bag" />
					</Link>

					{/* Cart */}
					<button
						className="relative text-2xl text-blue-600 cart-button"
						onClick={() => setCartOpen(!cartOpen)}
						title="Cart"
					>
						<i className="pi pi-shopping-cart" />
						{cartItems?.length > 0 && (
							<span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-1">
								{cartItems.length}
							</span>
						)}
					</button>

					{/* User Menu */}
					<div className="relative">
						{currentUser ? (
							<button
								className="user-button px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
								onClick={() => setMenuOpen(!menuOpen)}
								title="User Menu"
							>
								{currentUser.data.fullName}{" "}
								<i className="pi pi-angle-down ml-1"></i>
							</button>
						) : (
							<button
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
								onClick={handleLoginClick}
								title="Login"
							>
								Login <i className="pi pi-angle-down ml-1"></i>
							</button>
						)}

						{menuOpen && currentUser && (
							<div
								ref={menuRef}
								className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-lg rounded-lg py-2 z-50"
							>
								<button
									onClick={() => {
										setMenuOpen(false);
										navigate("/profile");
									}}
									className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
								>
									My Profile
								</button>
								<button
									onClick={() => {
										setMenuOpen(false);
										navigate("/ordersbuyer");
									}}
									className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
								>
									Orders
								</button>
								<Link
									to=""
									className="block px-4 py-2 hover:bg-gray-100 text-sm"
								>
									Wishlist
								</Link>
								<Link
									to=""
									className="block px-4 py-2 hover:bg-gray-100 text-sm"
								>
									Rewards
								</Link>
								<button
									onClick={handleLogout}
									className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
								>
									Logout
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Cart Modal */}
			{cartOpen && (
				<div
					ref={cartRef}
					className="fixed top-16 right-4 w-96 bg-white border shadow-lg z-50 rounded-lg p-4"
				>
					{/* Cross Button */}
					<button
						onClick={() => setCartOpen(false)}
						className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
						title="Close Cart"
					>
						&times;
					</button>

					<h3 className="text-lg font-semibold mb-4">Your Cart</h3>
					{cartItems.length === 0 ? (
						<p className="text-gray-500">Your cart is empty.</p>
					) : (
						<div className="space-y-4 max-h-[400px] overflow-y-auto">
							{cartItems.map((item, idx) => (
								<div
									key={idx}
									className="flex gap-4 border-b pb-3"
								>
									<img
										src={
											item.image ||
											"https://via.placeholder.com/60"
										}
										alt={item.title}
										className="w-16 h-16 object-cover rounded"
									/>
									<div className="flex-1">
										<h4 className="font-semibold text-sm">
											{item.title}
										</h4>
										<p className="text-gray-500 text-xs">
											₹{item.price}
										</p>
										<div className="flex items-center mt-1 space-x-2">
											<button
												onClick={() =>
													updateQuantity(
														item.productId,
														(item.quantity || 1) - 1
													)
												}
												className="bg-gray-200 px-2 rounded disabled:opacity-50"
												disabled={item.quantity <= 1}
											>
												-
											</button>
											<span>{item.quantity || 1}</span>
											<button
												onClick={() =>
													updateQuantity(
														item.productId,
														(item.quantity || 1) + 1
													)
												}
												className="bg-gray-200 px-2 rounded"
											>
												+
											</button>
										</div>
									</div>
								</div>
							))}
							<div className="flex justify-between mt-4">
								<button
									onClick={handleremove}
									className="text-red-500 hover:underline"
								>
									Remove All
								</button>
								<button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
									Checkout
								</button>
							</div>
						</div>
					)}
				</div>
			)}
		</nav>
	);
};

export default Navbar;
