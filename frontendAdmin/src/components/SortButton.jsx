import React, { useState } from "react";

const SortButton = ({ onSort }) => {
  const [order, setOrder] = useState("asc");

  const toggleSort = () => {
    const newOrder = order === "asc" ? "desc" : "asc";
    setOrder(newOrder);
    onSort(newOrder);
  };

  return (
    <button
      onClick={toggleSort}
      className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center gap-3"
    >
      <span className="text-xl">{order === "asc" ? "↑" : "↓"}</span>
      Sort {order === "asc" ? "A → Z" : "Z → A"}
    </button>
  );
};

export default SortButton;
