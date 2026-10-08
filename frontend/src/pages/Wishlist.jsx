import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWishlist, removeFromWishlist } from "../services/api";
import ProductCard from "../components/ProductCard.jsx";

function Wishlist() {
  const [wishlist, setWishlist] = useState(null);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState("");

  const loadWishlist = async () => {
    setError("");
    setWishlist(null);

    try {
      const response = await getWishlist();
      setWishlist(response.data.wishlist);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to load wishlist.",
      );
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    setError("");

    try {
      await removeFromWishlist(productId);
      setWishlist((currentWishlist) =>
        currentWishlist.filter((product) => product._id !== productId),
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to remove product. Please try again.",
      );
    } finally {
      setRemovingId("");
    }
  };

  if (wishlist === null && !error) {
    return (
      <main className="shop-main">
        <div className="page-status">
          <div className="status-icon">⏳</div>
          <h1>Loading your wishlist...</h1>
        </div>
      </main>
    );
  }

  if (error && wishlist === null) {
    return (
      <main className="shop-main">
        <div className="page-status">
          <div className="status-icon">!</div>
          <h1>Something went wrong.</h1>
          <p>We couldn&apos;t load your wishlist.</p>
          <button type="button" onClick={loadWishlist} className="button-primary">
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (wishlist.length === 0) {
    return (
      <main className="shop-main">
        <div className="empty-state">
          <div className="empty-state-icon">♥</div>
          <h1>Your wishlist is empty</h1>
          <p>Save products you love and find them here later.</p>
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
          <p className="eyebrow">Your little corner</p>
          <h1>My Wishlist</h1>
          <p>{wishlist.length} products saved</p>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="product-grid">
        {wishlist.map((product) => (
          <div
            key={product._id}
            className={removingId === product._id ? "opacity-60" : ""}
          >
            <ProductCard product={product} onRemove={handleRemove} />
          </div>
        ))}
      </div>
    </main>
  );
}

export default Wishlist;
