const SearchFilters = ({ filters, onFilterChange }) => {
  const handleChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
    })
  }

  return (
    <div className="flex flex-wrap gap-4">
      <input
        type="text"
        placeholder="Search by name..."
        value={filters.name}
        onChange={(e) => handleChange('name', e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
      />
      <input
        type="text"
        placeholder="Category..."
        value={filters.category}
        onChange={(e) => handleChange('category', e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
      />
      <input
        type="number"
        placeholder="Min Price"
        value={filters.minPrice}
        onChange={(e) => handleChange('minPrice', e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 w-24"
      />
      <input
        type="number"
        placeholder="Max Price"
        value={filters.maxPrice}
        onChange={(e) => handleChange('maxPrice', e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 w-24"
      />
    </div>
  )
}

export default SearchFilters

