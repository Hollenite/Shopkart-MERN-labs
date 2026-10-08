import { Link } from "react-router-dom";
import { addToWishlist } from "../services/api";
import { useState } from "react";
import { useCart } from "../context/useCart";

function ProductCard({ product, onRemove }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const { addToCart, actionLoading } = useCart();
  const addingToCart = actionLoading === product._id;

  const handleWishlist = async () => {
    setSaving(true);
    setError("");

    try {
      await addToWishlist(product._id);
      setSaved(true);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to save product. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAddToCart = async () => {
    setError("");

    try {
      await addToCart(product._id);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to add product to cart. Please try again.",
      );
    }
  };

  return (
    <article className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-photo"
      />
      <div className="product-card-body">
        <p className="product-category">{product.category}</p>
        <h2>{product.name}</h2>
        <p className="product-price">₹{product.price}</p>
        <p className="stock-note">{product.stock > 0 ? `${product.stock} units left` : "Out of stock"}</p>
        <div className="card-actions">
          <Link to={`/products/${product._id}`} className="button-secondary">View Details</Link>
          {onRemove ? (
            <button type="button" onClick={() => onRemove(product._id)} className="button-danger">Remove from Wishlist</button>
          ) : (
            <button type="button" onClick={handleWishlist} disabled={saving || saved} className="button-secondary">
              {saving ? "⏳ Saving..." : saved ? "♥ Added to Wishlist" : "♡ Add to Wishlist"}
            </button>
          )}
          <button type="button" onClick={handleAddToCart} disabled={addingToCart || product.stock === 0} className="button-primary">
            {addingToCart ? "Adding..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    </article>
  );
}

export default ProductCard;
