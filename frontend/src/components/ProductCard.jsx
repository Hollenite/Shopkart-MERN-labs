import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <img src={product.image} alt={product.name} className="product-photo" />
      <div className="product-card-body">
        <p className="product-category">{product.category}</p>
        <h2>{product.name}</h2>
        <p className="product-price">₹{product.price}</p>
        <p className="stock-note">
          {product.stock > 0 ? `${product.stock} units left` : "Out of stock"}
        </p>
        <div className="card-actions">
          <Link to={`/products/${product._id}`} className="button-secondary">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
