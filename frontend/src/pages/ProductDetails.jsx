import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addToWishlist, getProduct } from "../services/api";
import { useCart } from "../context/useCart";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [savingWishlist, setSavingWishlist] = useState(false);
  const { addToCart, actionLoading } = useCart();

  const handleWishlist = async () => {
    setWishlistMessage("");
    setSavingWishlist(true);

    try {
      await addToWishlist(product._id);
      setWishlistMessage("Added to wishlist");
    } catch (requestError) {
      setWishlistMessage(
        requestError.response?.data?.message ||
          "Unable to add product to wishlist",
      );
    } finally {
      setSavingWishlist(false);
    }
  };

  const handleAddToCart = async () => {
    setCartMessage("");

    try {
      await addToCart(product._id);
      setCartMessage("Added to cart");
    } catch (requestError) {
      setCartMessage(
        requestError.response?.data?.message ||
          "Unable to add product to cart",
      );
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(id);
        setProduct(response.data.product);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="shop-main">
        <div className="page-status">
          <div className="status-icon">⏳</div>
          <h1>Loading products...</h1>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="shop-main">
        <div className="page-status">
          <div className="status-icon">!</div>
          <h1>Something went wrong while loading products.</h1>
          <Link to="/products" className="button-secondary">
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="shop-main">
      <section className="details-layout">
        <img src={product.image} alt={product.name} className="details-photo" />
        <article className="content-card">
          <p className="product-category">{product.category}</p>
          <h1 className="page-heading" style={{ fontSize: "2rem" }}>
            {product.name}
          </h1>
          <p>{product.description}</p>
          <p className="product-price">₹{product.price}</p>
          <p className="stock-note">
            {product.stock > 0 ? `${product.stock} units left` : "Out of stock"}
          </p>
          <div className="card-actions" style={{ maxWidth: "22rem" }}>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={actionLoading === product._id || product.stock === 0}
              className="button-primary"
            >
              {actionLoading === product._id
                ? "Adding..."
                : product.stock === 0
                  ? "Out of Stock"
                  : "Add to Cart"}
            </button>
            <button
              type="button"
              onClick={handleWishlist}
              disabled={savingWishlist}
              className="button-secondary"
            >
              {savingWishlist ? "⏳ Saving..." : "♡ Add to Wishlist"}
            </button>
          </div>
          {cartMessage && <p className="success">{cartMessage}</p>}
          {wishlistMessage && <p className="order-meta">{wishlistMessage}</p>}
          <p>
            <Link to="/products">Back to products</Link>
          </p>
        </article>
      </section>
    </main>
  );
}

export default ProductDetails;
