import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import { useCart } from "../context/useCart";

function Cart() {
  const { cartItems, cartCount, subtotal, loading, error, refreshCart } = useCart();

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

  if (error && cartItems.length === 0) {
    return (
      <main className="shop-main">
        <div className="page-status">
          <div className="status-icon">!</div>
          <h1>Unable to load your cart.</h1>
          <p>{error}</p>
          <button type="button" onClick={refreshCart} className="button-primary">
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="shop-main">
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h1>Your cart is empty</h1>
          <p>Looks like you haven&apos;t added anything yet.</p>
          <Link to="/products" className="button-primary">
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="shop-main">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Ready when you are</p>
          <h1>My Cart</h1>
          <p>{cartCount} items in your bag.</p>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="checkout-layout">
        <div className="grid gap-4">
          {cartItems.map((item) => (
            <CartItem key={item.product?._id} item={item} />
          ))}
        </div>
        <aside className="summary-card">
          <h2>Order Summary</h2>
          <p className="summary-line">
            <span>Items</span>
            <span>{cartCount}</span>
          </p>
          <p className="summary-line summary-total">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </p>
          <Link to="/checkout" className="button-primary">
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </main>
  );
}

export default Cart;
