import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import { getProducts } from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await getProducts({ search, category });
        setProducts(response.data.products);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category]);

  return (
    <main className="shop-main">
      <h1>Explore products</h1>
      <SearchBar
        search={search}
        category={category}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
      />
      {loading && <p>Loading products...</p>}
      {error && <p>Something went wrong while loading products.</p>}
      {!loading && !error && products.length === 0 && <p>No products found.</p>}
      {!loading && !error && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}

export default Products;
