import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";

function CartItem({ item }) {
  const { actionLoading, updateQuantity, removeFromCart } = useCart();
  const product = item.product;
  const isUpdating = actionLoading === product._id;

  if (!product) return null;

  return (
    <article className="content-card cart-item">
      <img src={product.image} alt={product.name} className="cart-item-image" />
      <div className="cart-item-info">
        <Link to={`/products/${product._id}`}>{product.name}</Link>
        <p>₹{product.price}</p>
        <p className="stock-note">{product.stock} units available</p>
        <div className="quantity-controls">
          <button
            type="button"
            onClick={() => updateQuantity(product._id, item.quantity - 1)}
            disabled={isUpdating || item.quantity === 1}
          >
            −
          </button>
          <span>{item.quantity}</span>
          <button
            type="button"
            onClick={() => updateQuantity(product._id, item.quantity + 1)}
            disabled={isUpdating || item.quantity >= product.stock}
          >
            +
          </button>
          <button
            type="button"
            onClick={() => removeFromCart(product._id)}
            disabled={isUpdating}
            className="remove-action"
          >
            Remove
          </button>
        </div>
      </div>
      <p className="cart-item-total">₹{product.price * item.quantity}</p>
    </article>
  );
}

export default CartItem;
