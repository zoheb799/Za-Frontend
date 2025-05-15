import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { Skeleton } from "primereact/skeleton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

const Products = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const { currentUser } = useSelector((store) => store.user);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await axios.get("/api/v1/product/all");
				const backendProducts = response.data.data || [];
				const mappedProducts = backendProducts.map((product) => ({
					...product,
					name: product.title,
					image:
						product.images?.[0] ||
						"https://via.placeholder.com/150",
					rating: 4,
					category: "General",
					inventoryStatus:
						product.stock > 10
							? "INSTOCK"
							: product.stock > 0
							? "LOWSTOCK"
							: "OUTOFSTOCK",
				}));
				setProducts(mappedProducts);
			} catch (error) {
				console.error("Error fetching products:", error);
			}
			setLoading(false);
		};

		fetchProducts();
	}, []);

	const getSeverity = (status) => {
		switch (status) {
			case "INSTOCK":
				return "success";
			case "LOWSTOCK":
				return "warning";
			case "OUTOFSTOCK":
				return "danger";
			default:
				return null;
		}
	};

	const handleAddToCart = async (product) => {
		try {
			await axios.post(
				`/api/v1/product/add-to-cart/${product._id}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${currentUser?.data?.accessToken}`,
					},
				}
			);
			toast.success(`${product.title} added to cart!`);
		} catch (error) {
			console.error("Add to cart failed", error);
			toast.error(
				error?.response?.data?.message || "Failed to add to cart"
			);
		}
	};

	const handleCardClick = (id) => {
		navigate(`/product/${id}`);
	};

	const skeletonCard = () => (
		<div className="p-4 border rounded-lg bg-white shadow-md">
			<Skeleton height="12rem" className="mb-3" />
			<Skeleton width="80%" className="mb-2" />
			<Skeleton width="60%" className="mb-2" />
			<Skeleton width="50%" height="1.5rem" className="mb-2" />
			<div className="flex gap-2 justify-center mb-3">
				<Skeleton width="4rem" height="1.5rem" />
				<Skeleton width="4rem" height="1.5rem" />
			</div>
			<Skeleton width="60%" height="2rem" className="mx-auto" />
		</div>
	);

	return (
		<div className="min-h-screen bg-blue-900 p-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
				{loading
					? Array.from({ length: 8 }).map((_, i) => (
							<div key={i}>{skeletonCard()}</div>
					  ))
					: products.map((product) => (
							<div
								key={product._id}
								onClick={() => handleCardClick(product._id)}
								className="p-4 border rounded-lg bg-white shadow-md text-center hover:shadow-lg transition-shadow duration-300"
							>
								<img
									src={product.image}
									alt={product.title}
									className="w-full h-48 object-contain mb-4"
								/>
								<div className="text-lg font-semibold mb-1">
									{product.title}
								</div>
								<div className="text-sm text-gray-600 mb-1">
									Seller: {product.sellerId?.fullName}
								</div>
								<div className="justify-center items-center flex">
									<Rating
										value={product.rating}
										readOnly
										cancel={false}
										className="mb-2"
									/>
								</div>
								<div className="flex justify-center items-center gap-2 mb-2">
									<i className="pi pi-tag"></i>
									<span>{product.category}</span>
									<Tag
										value={product.inventoryStatus}
										severity={getSeverity(
											product.inventoryStatus
										)}
									/>
								</div>
								<div className="text-xl font-bold text-green-700 mb-3">
									₹{product.price}
								</div>
								<Button
									icon="pi pi-shopping-cart"
									label="Add to Cart"
									className="w-[50%]"
									disabled={
										product.inventoryStatus === "OUTOFSTOCK"
									}
									onClick={(e) => {
										e.stopPropagation();
										handleAddToCart(product);
									}}
								/>
							</div>
					  ))}
			</div>
		</div>
	);
};

export default Products;
