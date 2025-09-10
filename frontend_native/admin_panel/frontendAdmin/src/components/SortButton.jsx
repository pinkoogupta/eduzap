import React, { useState } from 'react';

const SortButton = ({ onSort }) => {
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    onSort(newOrder);
  };

  return (
    <button
      onClick={handleSort}
      style={{
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '20px',
      }}
    >
      Sort {sortOrder === 'asc' ? 'Z-A' : 'A-Z'}
    </button>
  );
};

export default SortButton;