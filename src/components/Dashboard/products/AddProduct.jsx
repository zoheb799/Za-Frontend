import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "../../../api/axios.js";
import {toast} from "react-toastify";
import { useSelector } from "react-redux";
import { ProgressSpinner } from "primereact/progressspinner";
import { useParams } from "react-router-dom";
import { FileUpload } from "primereact/fileupload";
import { Dropdown } from "primereact/dropdown";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary";

const statusList = ["Available", "Out of Stock", "Discontinued"];

const AddProduct = ({ setShow, product = null, mode = "add", setShouldReload }) => {
    const { currentUser } = useSelector((store) => store.user);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        trigger,
        watch,
        reset,
    } = useForm({
        defaultValues: {
            title: "",
            category: "",
            price: "",
            stock: "",
            description: "",
            status: "",
        },
    });

    const [existingImages, setExistingImages] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [files, setFiles] = useState(existingImages);
    const [loading, setLoading] = useState(false);
    const [updatedImages, setUpdatedImages] = useState([]);

    const fileUploadRef = useRef(null);

    useEffect(() => {
        if (product) {
            reset({
                ...product,
                price: product.price || "",
                stock: product.stock || "",
                category: product.category || "",
                status: product.status || "",
                description: product.description || "",
            });
        }
    }, [product, reset]);

    const handleFileUpload = async (event) => {
        if (!event.files || event.files.length === 0) return;
    
        const newFiles = event.files.map((file) => ({
            file,
            status: "pending",
            url: null,
        }));
    
        setUploadedFiles((prev) => [...prev, ...newFiles]);
    
        for (const fileObj of newFiles) {
            try {
                const url = await uploadToCloudinary(fileObj.file, "products"); // specify folder like 'products' or 'profiles'
    
                setUploadedFiles((prev) =>
                    prev.map((f) =>
                        f.file === fileObj.file
                            ? { ...f, status: "uploaded", url }
                            : f
                    )
                );
    
                toast.success(`${fileObj.file.name} uploaded successfully!`);
            } catch (error) {
                console.error("Cloudinary upload failed", error);
    
                setUploadedFiles((prev) =>
                    prev.map((f) =>
                        f.file === fileObj.file ? { ...f, status: "failed" } : f
                    )
                );
    
                toast.error(`Failed to upload ${fileObj.file.name}`);
            }
        }
    };
    const onSubmit = async (data) => {
        setLoading(true);
    
        try {
            // Collect URLs from uploaded files
            const imageUrls = uploadedFiles
                .filter((f) => f.status === "uploaded" && f.url)
                .map((f) => f.url);
    
            // Merge with any existing URLs (if editing)
            const finalImageUrls = [...updatedImages, ...imageUrls];
    
            const payload = {
                title: data.title,
                price: data.price,
                stock: data.stock,
                status: data.status,
                description: data.description,
                images: finalImageUrls,
            };
    
            let response;
            if (mode === "edit" && product?._id) {
                response = await axios.put(`/api/v1/product/${product._id}`, payload);
            } else {
                response = await axios.post("/api/v1/product/add", payload);
            }
    
            if (response?.data?.statusCode === 200 || response?.data?.statusCode === 201) {
                toast.success(`Product ${mode === "edit" ? "updated" : "created"} successfully!`);
                setShouldReload((prev) => !prev);
                setShow(false);
            } else {
                toast.error("Something went wrong!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error submitting product");
        } finally {
            setLoading(false);
        }
    };
    
    const removeExistingImage = (index) => {
        const updatedImages = existingImages.filter((_, i) => i !== index);
        setExistingImages(updatedImages);
        setUpdatedImages(updatedImages);
        setFiles(updatedImages);
    };

    return (
        <div className="p-4 rounded-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label>
                        Product title <span className="text-red-500"> *</span>
                    </label>
                    <InputText
                        {...register("title", {
                            required: "Product title is required",
                        })}
                        className="w-full"
                    />
                    {errors.title && (
                        <small className="text-red-500">
                            {errors.name.message}
                        </small>
                    )}
                </div>


                {/* Price */}
                <div>
                    <label>
                        Price <span className="text-red-500"> *</span>
                    </label>
                    <InputText
                        {...register("price", { required: "Price is required" })}
                        className="w-full"
                    />
                    {errors.price && (
                        <small className="text-red-500">
                            {errors.price.message}
                        </small>
                    )}
                </div>

                {/* Stock */}
                <div>
                    <label>
                        Stock <span className="text-red-500"> *</span>
                    </label>
                    <InputText
                        {...register("stock", { required: "Stock is required" })}
                        className="w-full"
                    />
                    {errors.stock && (
                        <small className="text-red-500">
                            {errors.stock.message}
                        </small>
                    )}
                </div>

                {/* Status */}
                <div>
                    <label>Status</label>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Dropdown
                                {...field}
                                options={statusList}
                                placeholder="Select Status"
                                className="w-full"
                            />
                        )}
                    />
                </div>

                {/* Description */}
                <div>
                    <label>Description</label>
                    <InputText
                        {...register("description")}
                        className="w-full"
                        rows={5}
                        textarea
                    />
                </div>

                {/* Product Images */}
                <div>
                    <label className="font-medium">Product Images</label>

                    {files.map((file, index) => {
                        const fileUrl =
                            typeof file === "string"
                                ? file
                                : URL.createObjectURL(file);
                        return (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-2 border-b"
                            >
                                <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    className="text-blue-600 underline"
                                >
                                    📄 Image {index + 1}
                                </a>

                                <Button
                                    icon="pi pi-times"
                                    className="p-button-text text-red-500"
                                    onClick={() => removeExistingImage(index)}
                                />
                            </div>
                        );
                    })}

                    <Controller
                        name="images"
                        control={control}
                        render={({ field }) => (
                            <FileUpload
                                ref={fileUploadRef}
                                name="files"
                                customUpload
                                uploadHandler={handleFileUpload}
                                multiple
                                emptyTemplate={
                                    <p className="text-gray-500">
                                        Drag and drop images here or click to
                                        upload
                                    </p>
                                }
                            />
                        )}
                    />
                </div>

                {loading ? (
                    <ProgressSpinner
                        style={{
                            width: "50px",
                            height: "50px",
                        }}
                        strokeWidth="8"
                        fill="var(--surface-ground)"
                        animationDuration=".5s"
                    />
                ) : (
                    <Button label="Save" type="submit" />
                )}
            </form>
        </div>
    );
};

export default AddProduct;
