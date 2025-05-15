import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog } from "primereact/confirmdialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";
import axios from "axios";
import { toast } from "react-toastify";
import AddProduct from "./AddProduct";
import DeleteModal from "../../../shared/DeleteModal";

const ProductsPage = () => {
	const { register, watch } = useForm({ defaultValues: { search: "" } });
	const search = watch("search");

	const navigate = useNavigate();
	const { currentUser } = useSelector((store) => store.user);

	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [showDialog, setShowDialog] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const [confirmVisible, setConfirmVisible] = useState(false);
	const [dialogMode, setDialogMode] = useState("add");
	const [currentProduct, setCurrentProduct] = useState(null);
	const [shouldReload, setShouldReload] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true);
			try {
				const { data } = await axios.get("/api/v1/product/my-products");
				setProducts(data.data);
				setFilteredProducts(data.data);
			} catch (error) {
				console.error("Failed to fetch products", error);
				toast.error("Error fetching products");
			} finally {
				setLoading(false);
			}
		};
		fetchProducts();
	}, [shouldReload]);

	useEffect(() => {
		const lowerSearch = search.toLowerCase();
		const filtered = products.filter((product) =>
			product.title.toLowerCase().includes(lowerSearch)
		);
		setFilteredProducts(filtered);
	}, [search, products]);

	const handleAdd = () => {
		setCurrentProduct(null);
		setDialogMode("add");
		setShowDialog(true);
	};

	const handleEdit = (product) => {
		setCurrentProduct(product);
		setDialogMode("edit");
		setShowDialog(true);
	};

	const handleDelete = async () => {
		try {
			await axios.delete(`/api/v1/product/${deleteId}`);
			toast.success("Product deleted successfully");
			setShouldReload((prev) => !prev);
		} catch (err) {
			toast.error("Failed to delete product");
		} finally {
			setConfirmVisible(false);
		}
	};

	const imageTemplate = (rowData) => (
		<img
			src={rowData.images[0]}
			alt={rowData.title}
			className="h-10 w-10 object-cover rounded-full"
		/>
	);

	const skeletonRows = Array.from({ length: 5 });

	return (
		<>
			<ConfirmDialog />

			{/* Header + Search */}
			<div className="mx-5 my-4 flex flex-wrap items-center justify-between gap-4 text-xs">
				<div className="flex gap-2">
					<Button
						label="Add Product"
						onClick={handleAdd}
						className="h-9"
						severity="info"
						size="small"
						icon="pi pi-plus"
					/>
				</div>
				<div className="w-full md:w-100">
					<IconField iconPosition="left" className="h-10 w-full">
						<InputIcon className="pi pi-search h-10" />
						<InputText
							placeholder="Search products..."
							{...register("search")}
							className="h-10 w-full"
						/>
					</IconField>
				</div>
			</div>

			{/* Table or Skeleton */}
			<div className="mx-5">
				{loading ? (
					<div className="space-y-4">
						{skeletonRows.map((_, i) => (
							<div
								key={i}
								className="grid grid-cols-6 gap-4 items-center border p-3 rounded shadow-sm bg-white"
							>
								<Skeleton width="100%" height="1.5rem" />
								<Skeleton width="100%" height="1.5rem" />
								<Skeleton shape="circle" size="2rem" />
								<Skeleton width="100%" height="1.5rem" />
								<Skeleton width="100%" height="1.5rem" />
								<div className="flex gap-2">
									<Skeleton shape="circle" size="1.5rem" />
									<Skeleton shape="circle" size="1.5rem" />
								</div>
							</div>
						))}
					</div>
				) : (
					<DataTable
						value={filteredProducts}
						paginator
						rows={10}
						removableSort
						tableStyle={{ minWidth: "60rem" }}
					>
						<Column field="title" header="Title" sortable />
						<Column field="price" header="Price" sortable />
						<Column header="Image" body={imageTemplate} />
						<Column field="stock" header="Stock" sortable />
						<Column field="description" header="Description" />
						<Column
							header="Actions"
							body={(rowData) => (
								<div className="flex gap-3 items-center">
									<button onClick={() => handleEdit(rowData)}>
										<i className="pi pi-pencil text-green-500 cursor-pointer"></i>
									</button>
									<button
										onClick={() => {
											setConfirmVisible(true);
											setDeleteId(rowData._id);
										}}
									>
										<i className="pi pi-trash text-red-500 cursor-pointer"></i>
									</button>
								</div>
							)}
						/>
					</DataTable>
				)}
			</div>

			{/* Dialogs */}
			<Dialog
				header={dialogMode === "edit" ? "Edit Product" : "Add Product"}
				visible={showDialog}
				style={{ width: "75vw" }}
				onHide={() => setShowDialog(false)}
				draggable={false}
			>
				<AddProduct
					product={currentProduct}
					mode={dialogMode}
					setShow={setShowDialog}
					setShouldReload={setShouldReload}
				/>
			</Dialog>

			<DeleteModal
				visible={confirmVisible}
				setVisible={setConfirmVisible}
				handleDelete={handleDelete}
			/>
		</>
	);
};

export default ProductsPage;
