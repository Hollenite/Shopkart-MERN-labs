import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPaymentOrder, verifyPayment } from "../services/api";
import { useCart } from "../context/useCart";

const initialAddress = {
  fullName: "",
  phone: "",
  addressLine1: "",
  city: "",
  state: "",
  pincode: "",
};

const fieldLabels = {
  fullName: "Full Name",
  phone: "Phone",
  addressLine1: "Address",
  city: "City",
  state: "State",
  pincode: "Pincode",
};

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartCount, subtotal, loading, error, clearCart, refreshCart } =
    useCart();
  const [address, setAddress] = useState(initialAddress);
  const [formError, setFormError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const handleChange = (event) => {
    setAddress({ ...address, [event.target.name]: event.target.value });
    setFormError("");
  };

  const validate = () => {
    if (Object.values(address).some((value) => !value.trim())) {
      return "All shipping fields are required";
    }
    if (!/^\d{10}$/.test(address.phone.trim())) {
      return "Phone must contain 10 digits";
    }
    if (!/^\d{6}$/.test(address.pincode.trim())) {
      return "Pincode must contain 6 digits";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setPlacingOrder(true);
    setFormError("");

    try {
      const scriptLoaded = await loadRazorpay();
      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay Checkout");
      }

      const { data } = await createPaymentOrder(address);
      const razorpay = new window.Razorpay({
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "ShopKart",
        description: "ShopKart Order",
        order_id: data.razorpayOrderId,
        prefill: {
          name: address.fullName,
          contact: address.phone,
        },
        handler: async (payment) => {
          try {
            await verifyPayment({
              shopKartOrderId: data.shopKartOrderId,
              razorpay_order_id: payment.razorpay_order_id,
              razorpay_payment_id: payment.razorpay_payment_id,
              razorpay_signature: payment.razorpay_signature,
            });
            clearCart();
            navigate(`/orders/${data.shopKartOrderId}`);
          } catch (requestError) {
            setFormError(
              requestError.response?.data?.message ||
                "Payment verification failed. Your cart was not cleared.",
            );
          } finally {
            setPlacingOrder(false);
          }
        },
      });

      razorpay.on("payment.failed", () => {
        setFormError("Payment failed. Your cart has not been cleared.");
        setPlacingOrder(false);
      });
      razorpay.open();
    } catch (requestError) {
      setFormError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to start checkout",
      );
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <main className="shop-main">
        <div className="page-status">
          <div className="status-icon">⏳</div>
          <h1>Loading your cart...</h1>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="shop-main">
        <div className="page-status">
          <div className="status-icon">!</div>
          <h1>Unable to load checkout.</h1>
          <p>{error}</p>
          <button type="button" onClick={refreshCart} className="button-primary">
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!cartItems.length) {
    return (
      <main className="shop-main">
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h1>Your cart is empty</h1>
          <p>Add something before checking out.</p>
          <Link to="/products" className="button-primary">
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="shop-main checkout-layout">
      <form onSubmit={handleSubmit} className="content-card form-card">
        <p className="eyebrow">Almost yours</p>
        <h1 className="page-heading">Checkout</h1>
        {formError && <p className="error">{formError}</p>}
        {Object.entries(address).map(([field, value]) => (
          <label key={field}>
            {fieldLabels[field]}
            <input name={field} value={value} onChange={handleChange} />
          </label>
        ))}
        <button type="submit" disabled={placingOrder}>
          {placingOrder ? "Processing..." : "Place Order"}
        </button>
      </form>
      <aside className="summary-card">
        <h2>Order Summary</h2>
        {cartItems.map((item) => (
          <p key={item.product?._id} className="summary-line">
            <span>
              {item.product?.name} × {item.quantity}
            </span>
            <span>₹{(item.product?.price || 0) * item.quantity}</span>
          </p>
        ))}
        <p className="summary-line">
          <span>Items</span>
          <span>{cartCount}</span>
        </p>
        <p className="summary-line summary-total">
          <span>Total</span>
          <span>₹{subtotal}</span>
        </p>
      </aside>
    </main>
  );
}

export default Checkout;
