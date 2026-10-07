import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrder } from "../services/api";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrder(id)
      .then((response) => setOrder(response.data.order))
      .catch((requestError) =>
        setError(requestError.response?.data?.message || "Unable to load order"),
      );
  }, [id]);

  if (!order && !error) {
    return (
      <main className="shop-main">
        <div className="page-status">
          <div className="status-icon">⏳</div>
          <h1>Loading order...</h1>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="shop-main">
        <div className="page-status">
          <div className="status-icon">!</div>
          <h1>Unable to load order.</h1>
          <p>{error}</p>
          <Link to="/orders" className="button-secondary">
            View My Orders
          </Link>
        </div>
      </main>
    );
  }

  const shipping = order.shippingAddress || {};

  return (
    <main className="shop-main">
      <section className="hero-card">
        <p className="eyebrow">Order confirmed</p>
        <h1>Order placed successfully</h1>
        <p>Your order has been saved successfully.</p>
      </section>
      <section className="content-card">
        <p className="order-meta">Order ID: {order._id}</p>
        <p className="status-chip">{order.status}</p>
        <h2 className="mt-4">₹{order.totalAmount}</h2>
        <div className="my-4 grid gap-2">
          {order.items.map((item) => (
            <p key={item.product} className="order-row">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </p>
          ))}
        </div>
        <div className="address-block">
          <p className="eyebrow">Shipping address</p>
          <p>{shipping.fullName}</p>
          <p>{shipping.addressLine1}</p>
          <p>
            {shipping.city}, {shipping.state} {shipping.pincode}
          </p>
          <p>{shipping.phone}</p>
        </div>
        <div className="card-actions" style={{ maxWidth: "24rem", marginTop: "1.5rem" }}>
          <Link to="/orders" className="button-primary">
            View My Orders
          </Link>
          <Link to="/products" className="button-secondary">
            Continue Shopping
          </Link>
        </div>
      </section>
    </main>
  );
}

export default OrderDetails;
