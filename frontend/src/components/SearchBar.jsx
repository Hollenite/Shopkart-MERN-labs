function SearchBar({ search, category, onSearchChange, onCategoryChange }) {
  return (
    <div className="filter-bar">
      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search products..."
      />
      <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
        <option value="">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Fashion">Fashion</option>
        <option value="Books">Books</option>
        <option value="Home">Home</option>
      </select>
    </div>
  );
}

export default SearchBar;
