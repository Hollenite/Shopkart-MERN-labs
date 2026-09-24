import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  if (loading) return <p className="p-6">Loading products...</p>;
  if (error || !product)
    return <p className="p-6">Something went wrong while loading products.</p>;

  return (
    <main className="shop-main">
      <img src={product.image} alt={product.name} className="product-photo" />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Category: {product.category}</p>
      <p>Price: ₹{product.price}</p>
      <p>Stock: {product.stock}</p>
      <button type="button">Add to Cart</button>
      <p>
        <Link to="/products">Back to products</Link>
      </p>
    </main>
  );
}

export default ProductDetails;
