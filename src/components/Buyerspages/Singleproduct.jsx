import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios.js";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Image } from "primereact/image";
import { Skeleton } from "primereact/skeleton";

const SingleProduct = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const image = product?.images?.[0];

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				setLoading(true);
				const res = await axios.get(`/api/v1/product/${id}`);
				setProduct(res.data.data);
			} catch (error) {
				console.error("Failed to fetch product", error);
			} finally {
				setLoading(false);
			}
		};
		fetchProduct();
	}, [id]);

	const handleAddToCart = async () => {
		try {
			await axios.post("/api/cart", {
				productId: product._id,
				quantity: 1,
			});
			alert(`${product.title} added to cart!`);
		} catch (error) {
			console.error("Add to cart failed", error);
		}
	};

	const handleBuyNow = () => {
		navigate("/payment", {
			state: {
				product: {
					id: product._id,
					title: product.title,
					image: image,
					sellerName: product.sellerId?.fullName,
					description: product.description,
					price: product.price,
				},
			},
		});
	};

	const handleChatToSeller = () => {
		navigate("/messages", {
			state: {
				sellerId: product.sellerId._id,
				productId: product._id,
				productName: product.title,
			},
		});
	};

	return (
		<div className=" p-6 bg-white flex flex-col md:flex-row gap-8 pt-24">
			{/* Left: Image */}
			<Card
				className="flex justify-center items-center md:w-1/2"
				style={{ minHeight: "450px" }}
				header={
					loading ? (
						<Skeleton
							width="400px"
							height="400px"
							className="border"
							shape="rectangle"
						/>
					) : (

						
						<Image
							src={image}
							alt={product.title}
							preview
							className="w-[300px] h-[300px] justify-center items-center flex object-contain"
						/>
					)
				}
			></Card>

			{/* Right: Product Details */}
			<Card className="md:w-1/2 flex flex-col justify-between">
				<div>
					{loading ? (
						<>
							<Skeleton
								width="60%"
								height="2.5rem"
								className="mb-4"
							/>
							<Skeleton
								width="30%"
								height="2rem"
								className="mb-4"
							/>
							<Skeleton
								width="100%"
								height="5rem"
								className="mb-4"
							/>
							<Skeleton
								width="40%"
								height="1.5rem"
								className="mb-6"
							/>
						</>
					) : (
						<>
							<h2 className="text-3xl font-bold mb-3">
								{product.title}
							</h2>
							<Tag
								value={`₹${product.price}`}
								severity="success"
								rounded
								className="text-xl font-semibold mb-4"
							/>
							<p className="mb-5 text-gray-700">
								{product.description}
							</p>
							<p className="mb-6 text-gray-600">
								Sold by:{" "}
								<span className="font-semibold text-gray-900">
									{product.sellerId?.fullName}
								</span>
							</p>
						</>
					)}
				</div>

				{/* Buttons */}
				<div className="flex flex-col sm:flex-row gap-4">
					{loading ? (
						<>
							<Skeleton width="100%" height="3rem" />
							<Skeleton width="100%" height="3rem" />
							<Skeleton width="100%" height="3rem" />
						</>
					) : (
						<>
							<Button
								label="Add to Cart"
								icon="pi pi-shopping-cart"
								className="p-button-warning"
								onClick={handleAddToCart}
							/>
							<Button
								label="Buy Now"
								icon="pi pi-credit-card"
								className="p-button-primary"
								onClick={handleBuyNow}
							/>
							<Button
								label="Chat to Seller"
								icon="pi pi-comments"
								className="p-button-secondary"
								onClick={handleChatToSeller}
							/>
						</>
					)}
				</div>
			</Card>
		</div>
	);
};

export default SingleProduct;
