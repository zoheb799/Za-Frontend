import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Skeleton } from "primereact/skeleton";
import axios from "axios";
import { debounce } from "lodash";
import { useSelector } from "react-redux";

const OrdersPage = () => {
	const [orders, setOrders] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [ordersCount, setOrdersCount] = useState(0);
	const [loading, setLoading] = useState(false);

	const { currentUser } = useSelector((store) => store.user);
	const userRole = currentUser?.data?.role;

	const fetchOrders = useCallback(async () => {
		setLoading(true);
		try {
			const response = await axios.get("/api/v1/orders/my-orders");
			setOrders(response.data?.message.orders);
			setOrdersCount(response.data?.message.orders.length);
		} catch (error) {
			console.error("Error fetching orders:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchOrders();
	}, [fetchOrders]);

	const handleSearch = useCallback(
		debounce((term) => {
			setSearchTerm(term.toLowerCase());
		}, 300),
		[]
	);

	const filteredOrders = useMemo(() => {
		if (!searchTerm) return orders;
		return orders.filter(
			({ buyer, productTitle, status }) =>
				buyer?.name?.toLowerCase().includes(searchTerm) ||
				productTitle?.toLowerCase().includes(searchTerm) ||
				status?.toLowerCase().includes(searchTerm)
		);
	}, [searchTerm, orders]);

	const statusTemplate = ({ status }) => {
		const statusClasses = {
			Pending: "bg-yellow-200 text-yellow-800",
			Confirmed: "bg-blue-200 text-blue-800",
			Shipped: "bg-purple-200 text-purple-800",
			Delivered: "bg-green-100 text-green-800",
			Cancelled: "bg-red-200 text-red-800",
		};
		return (
			<span
				className={`px-2 py-1 rounded-md text-sm flex items-center justify-center ${
					statusClasses[status] || "bg-gray-100 text-gray-800"
				}`}
			>
				{status}
			</span>
		);
	};

	const skeletonRows = Array.from({ length: 5 });

	return (
		<div className="p-6 bg-gray-100">
			{/* Orders Count */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
				{loading ? (
					<Card className="w-full h-26">
						<Skeleton
							width="80%"
							height="1.5rem"
							className="mb-3"
						/>
						<Skeleton width="60%" height="1.2rem" />
					</Card>
				) : (
					<Card className="flex items-center justify-between shadow-md gap-4 w-full h-26">
						<div>
							<p className="font-bold text-gray-600 ml-3 text-sm mb-6">
								Total Orders
							</p>
							<p className="text-md font-bold ml-3 text-blue-500">
								{ordersCount}
							</p>
						</div>
					</Card>
				)}
			</div>

			{/* Search */}
			<div className="flex justify-end mb-4">
				<div className="w-full md:w-96">
					<IconField iconPosition="left">
						<InputIcon className="pi pi-search" />
						<InputText
							placeholder="Search by buyer, product or status"
							onChange={(e) => handleSearch(e.target.value)}
						/>
					</IconField>
				</div>
			</div>

			{/* Orders Table */}
			<div className="card">
				{loading ? (
					<div className="space-y-4">
						{skeletonRows.map((_, i) => (
							<div
								key={i}
								className="grid grid-cols-6 gap-4 items-center border p-3 rounded shadow-sm bg-white"
							>
								<Skeleton width="100%" height="1.5rem" />
								<Skeleton width="100%" height="1.5rem" />
								<Skeleton width="100%" height="1.5rem" />
								<Skeleton width="100%" height="1.5rem" />
								<Skeleton width="100%" height="1.5rem" />
								<Skeleton width="100%" height="1.5rem" />
							</div>
						))}
					</div>
				) : (
					<DataTable
						value={filteredOrders}
						dataKey="_id"
						paginator
						rows={10}
						rowsPerPageOptions={[5, 10, 15, 20]}
						paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
						currentPageReportTemplate="{first} to {last} of {totalRecords}"
						className="shadow-md text-sm"
					>
						<Column field="_id" header="Order ID" />
						<Column field="buyer.fullName" header="Buyer" />
						<Column field="product.title" header="Product" />
						<Column field="product.stock" header="Qty" />
						<Column field="product.price" header="Total Price" />
						<Column
							field="status"
							header="Status"
							body={statusTemplate}
						/>
					</DataTable>
				)}
			</div>
		</div>
	);
};

export default OrdersPage;
