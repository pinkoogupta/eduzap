import React, { useState } from "react";

const SearchBar = ({ onSearch, onClear }) => {
  const [term, setTerm] = useState("");

  const handleSearch = () => {
    if (term.trim()) onSearch(term);
  };

  return (
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-50"></div>
      <div className="relative flex gap-3 bg-black/30 backdrop-blur-xl p-2 rounded-2xl border border-white/10">
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search for 'CUET'..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition duration-300"
        />
        <button 
          onClick={handleSearch} 
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
        >
          Search
        </button>
        <button
          onClick={() => {
            setTerm("");
            onClear();
          }}
          className="bg-white/10 backdrop-blur-xl text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transform hover:scale-105 transition-all duration-300 border border-white/20"
        >
          Clear
        </button>
      </div>
    </div>
  );
};


export default SearchBar;
