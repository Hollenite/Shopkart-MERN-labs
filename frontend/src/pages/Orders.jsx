import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../services/api";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function Orders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  const loadOrders = () => {
    setError("");
    setOrders(null);
    getOrders()
      .then((response) => setOrders(response.data.orders))
      .catch((requestError) =>
        setError(requestError.response?.data?.message || "Unable to load orders"),
      );
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (orders === null && !error) {
    return (
      <main className="shop-main">
        <div className="page-status">
          <div className="status-icon">⏳</div>
          <h1>Loading orders...</h1>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="shop-main">
        <div className="page-status">
          <div className="status-icon">!</div>
          <h1>Unable to load orders.</h1>
          <p>{error}</p>
          <button type="button" onClick={loadOrders} className="button-primary">
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!orders.length) {
    return (
      <main className="shop-main">
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h1>You have not placed any orders yet.</h1>
          <Link to="/products" className="button-primary">
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="shop-main">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Your history</p>
          <h1>My Orders</h1>
          <p>Everything you decided to keep.</p>
        </div>
      </div>
      <div className="grid gap-4">
        {orders.map((order) => (
          <article key={order._id} className="content-card">
            <div className="order-row">
              <div>
                <p>Order #{order._id.slice(-8)}</p>
                <p className="order-meta">{formatDate(order.createdAt)}</p>
                <p className="order-items">
                  {order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}
                </p>
                <p className="order-meta">Total: ₹{order.totalAmount}</p>
              </div>
              <div>
                <span className="status-chip">{order.status}</span>
              </div>
            </div>
            <Link to={`/orders/${order._id}`} className="button-secondary" style={{ maxWidth: "12rem" }}>
              View Details
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}

export default Orders;
