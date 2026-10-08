import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import { getProducts } from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(false);
        const params = { search, category };
        if (sort) params.sort = sort;
        const response = await getProducts(params);
        setProducts(response.data.products);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category, sort]);

  return (
    <main className="shop-main">
      <section className="hero-card">
        <p className="eyebrow">Your daily drop</p>
        <h1>
          Find something
          <br />
          worth keeping.
        </h1>
        <p>Browse pieces picked for your next small obsession.</p>
      </section>
      <div className="section-heading">
        <div>
          <h2>Explore products</h2>
          <p>Fresh finds, ready when you are.</p>
        </div>
        <Link to="/wishlist">View saved items</Link>
      </div>

      <SearchBar
        search={search}
        category={category}
        sort={sort}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onSortChange={setSort}
      />

      {loading && (
        <div className="page-status">
          <div className="status-icon">⏳</div>
          <h1>Loading products...</h1>
        </div>
      )}
      {error && (
        <div className="page-status">
          <div className="status-icon">!</div>
          <h1>Something went wrong while loading products.</h1>
        </div>
      )}
      {!loading && !error && products.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h1>No products found.</h1>
          <p>Try another search or category.</p>
        </div>
      )}

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
