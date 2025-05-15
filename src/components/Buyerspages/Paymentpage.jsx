import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CardElement } from "@stripe/react-stripe-js";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "axios";
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleSubmit } = useForm();
  const { currentUser } = useSelector((state) => state.user);

  const product = location.state?.product || {};
  const sellerName = location.state?.product?.sellerName || "";
  console.log(sellerName, "sellerName");
  
  const buyerId = currentUser?.data?._id;
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Skip actual stripe payment confirmation, directly call backend to simulate payment & save order
      const { data: responseData } = await axios.post(
        `/api/v1/orders/create-payment-intent`,
        {
          amount: product.price * 100, // amount in paise
          buyerId,
          product: product.id,
          sellerName,
        }
      );

      if (responseData.statusCode === 201 || responseData.statusCode === 200) {
        toast.success("Order placed successfully (payment simulated)!");
        setTimeout(() => navigate("/ordersbuyer"), 1500);
      } else {
        toast.error("Failed to place order.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-gray-50 pt-24 ">
      <ToastContainer />
      <h1 className="text-2xl justify-center items-center flex font-semibold mb-4"> Product Payment</h1>
      {/* Left: Product Summary */}
 
      <div className="p-6 flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2 bg-white p-6 rounded-xl shadow-md">
        <img
          src={product.image || "https://via.placeholder.com/400"}
          alt={product.title}
          className="w-full h-64 object-contain rounded-md"
        />
        <h2 className="text-xl font-semibold mt-4">{product.title}</h2>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <p className="text-lg font-bold mt-4 text-blue-600">
          ₹ {product.price}
        </p>
      </div>

      {/* Right: Stripe Card & Submit */}
      <div className="md:w-1/2 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>

        <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }} className="space-y-4">
          <div className="border rounded-md p-4">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#495057",
                    "::placeholder": { color: "#adb5bd" },
                  },
                  invalid: { color: "#f87171" },
                },
              }}
            />
          </div>

          <p className="text-sm italic text-gray-500">
            * Payment processing is currently disabled. This is a test order.
          </p>

          <Button
            type="submit"
            disabled={loading}
            label={loading ? "Processing..." : "Place Order"}
            icon={loading ? null : "pi pi-check"}
            className="w-full"
          >
            {loading && <ProgressSpinner style={{ width: '20px', height: '20px' }} strokeWidth="4" />}
          </Button>
        </form>
      </div>
      </div>

    </div>
  );
};

export default PaymentPage;
