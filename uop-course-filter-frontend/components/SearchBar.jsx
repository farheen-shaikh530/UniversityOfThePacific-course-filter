// src/components/SearchBar.jsx
import React from "react";

const SearchBar = ({ searchTerm, onSearch }) => {
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
      placeholder="Search for a UOP course..."
      style={{ padding: "10px", width: "300px", fontSize: "16px" }}
    />
  );
};

export default SearchBar;
