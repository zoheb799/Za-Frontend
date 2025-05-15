import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';

const SingleOrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="p-m-4 pt-24" style={{ maxWidth: 700, margin: 'auto' }}>
        <h3>No order data available.</h3>
        <Button label="Back to Orders" onClick={() => navigate('/ordersbuyer')} />
      </div>
    );
  }

  const { product, status, payment, createdAt } = order;
  const image = product.images?.[0] || 'https://via.placeholder.com/300x400';

  return (
    <div className=" pt-24 bg-white max-w-5xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Image Section */}
      <Card className="flex justify-center items-center" style={{ padding: 0 }}>
        <img
          src={image}
          alt={product.title}
          style={{ width: 300, height: 400, objectFit: 'contain' }}
        />
      </Card>

      {/* Product Info Section */}
      <Card className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{product.title}</h1>

        <p className="text-gray-600">{product.description}</p>

        <p className="text-xl text-green-600 font-semibold">
          ₹{product.price}
        </p>

        <p className="text-md text-gray-700">
          Sold by:{" "}
          <span className="font-semibold">
            {order.sellerName || product.sellerId?.fullName || "Unknown"}
          </span>
        </p>

        <p className="text-md text-gray-700">
          Order Status:{" "}
          <Tag
            value={status || 'Pending'}
            severity={
              status?.toLowerCase() === 'processing'
                ? 'info'
                : status?.toLowerCase() === 'completed'
                ? 'success'
                : 'warning'
            }
          />
        </p>

        <p className="text-md text-gray-700">
          Ordered on: <span className="font-semibold">{new Date(createdAt).toLocaleString()}</span>
        </p>

        {payment && (
          <Card className="mt-4 p-3" style={{ backgroundColor: '#f9f9f9' }}>
            <h2 className="text-lg font-semibold mb-2">Payment Details</h2>
            <p>Payment ID: {payment.paymentIntentId || payment._id || "N/A"}</p>
            <p>Amount Paid: ₹{payment.amount / 100 || payment.amount}</p>
            <p>Payment Method: {payment.method || "Card"}</p>
          </Card>
        )}
<div className=" justify-center items-center flex mt-24">
<Button label="Back to Orders" onClick={() => navigate('/ordersbuyer')} className="mt-auto" />

</div>
      </Card>
    </div>
  );
};

export default SingleOrderPage;
