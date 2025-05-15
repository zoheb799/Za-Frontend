import React from "react";
import { MegaMenu } from "primereact/megamenu";
import { Image } from "primereact/image";
import { Galleria } from "primereact/galleria";
import { DataView } from "primereact/dataview";
import { Tag } from "primereact/tag";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import accessories from "../assets/images/accessories.jpeg";
import armchair from "../assets/images/chair.jpeg";
import coffeeTable from "../assets/images/coffee.jpeg";
import couch from "../assets/images/couch.jpeg";  
import tvStand from "../assets/images/tv.jpeg";
import monitor from "../assets/images/monitor.jpeg";
import mouse from "../assets/images/mouse.jpeg";
import notebook from "../assets/images/notebook.jpeg";
import keyboard from "../assets/images/keyboard.jpeg";   
import image1 from "../assets/images/image1.webp";
import image2 from "../assets/images/image2.webp";
import image3 from "../assets/images/image3.webp";       


const furnitureItems = [
	{ label: "Accessories", image: accessories },
	{ label: "Armchair", image: armchair },
	{ label: "Coffee Table",   image: coffeeTable },
	{ label: "Couch", image: couch},
	{ label: "TV Stand", image: tvStand},
];

const electronicsItems = [
	{ label: "Monitor", image: monitor },
	{ label: "Mouse", image: mouse },
	{ label: "Notebook", image: notebook },
	{ label: "Keyboard", image: keyboard },
];
const renderGrid = (items) => (
	<div className="p-4 bg-white text-black flex justify-center items-center w-full">
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 w-fit">
			{items.map((item, idx) => (
				<div
					key={idx}
					className="text-center hover:scale-105 transition-transform duration-300 cursor-pointer"
				>
					<div className="w-[80px] h-[80px] mx-auto mb-2 overflow-hidden rounded">
						<Image
							src={item.image}
							alt={item.label}
							width={80}
							height={80}
							className="w-full h-full object-cover"
						/>
					</div>
					<div className="text-sm font-semibold">{item.label}</div>
				</div>
			))}
		</div>
	</div>
);

const images = [
	{ itemImageSrc: image1, alt: "Image 1", title: "Slide 1" },
	{ itemImageSrc: image2, alt: "Image 2", title: "Slide 2" },
	{ itemImageSrc: image3, alt: "Image 3", title: "Slide 3" },
];

const products = Array.from({ length: 8 }).map((_, i) => ({
	name: `Product ${i + 1}`,
	image: `/product${i + 1}.png`,
	price: 499 + i * 100,
	category: i % 2 === 0 ? "Accessories" : "Clothing",
	rating: 4 - (i % 2),
	inventoryStatus:
		i % 3 === 0 ? "INSTOCK" : i % 3 === 1 ? "LOWSTOCK" : "OUTOFSTOCK",
}));

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

const itemTemplate = (product) => {
	return (
		<div className="col-12 md:col-3 p-3">
			<div className="border-round-sm overflow-hidden shadow-1 surface-card p-3">
				<div className="flex justify-content-between align-items-center mb-2">
					<span className="text-sm text-color-secondary">
						<i className="pi pi-tag mr-2"></i>
						{product.category}
					</span>
					<Tag
						value={product.inventoryStatus}
						severity={getSeverity(product.inventoryStatus)}
					></Tag>
				</div>
				<img
					src={product.image}
					alt={product.name}
					className="w-full h-40 object-cover mb-2 border-round"
				/>
				<div className="font-bold text-lg mb-1">{product.name}</div>
				<Rating
					value={product.rating}
					readOnly
					cancel={false}
					className="mb-2"
				/>
				<div className="text-xl font-semibold mb-3">
					₹{product.price}
				</div>
				<Button
					icon="pi pi-shopping-cart"
					className="w-full"
					disabled={product.inventoryStatus === "OUTOFSTOCK"}
				></Button>
			</div>
		</div>
	);
};

const header = () => (
	<div className="text-xl font-bold mb-4 text-white">Top Deals</div>
);

const Homepage = () => {
	const items = [
		{
			label: "Furniture",
			icon: "pi pi-box",
			template: renderGrid(furnitureItems),
		},
		{
			label: "Electronics",
			icon: "pi pi-mobile",
			template: renderGrid(electronicsItems),
		},
	];

	return (
		<div className="text-white">
			<div className="card">
				<MegaMenu
					model={items}
					orientation="horizontal"
					className="w-full border-none justify-center items-center flex"
				/>
			</div>

			{/* Galleria Section */}
			<div className="my-6">
				<Galleria
					value={images}
					showThumbnails={false}
					showIndicators
					showItemNavigators
					autoPlay
					transitionInterval={4000}
					item={(item) => (
						<img
							src={item.itemImageSrc}
							alt={item.alt}
							style={{
								width: "100%",
								height: "500px",
								objectFit: "cover",
							}}
						/>
					)}
				/>
			</div>

		</div>
	);
};

export default Homepage;
