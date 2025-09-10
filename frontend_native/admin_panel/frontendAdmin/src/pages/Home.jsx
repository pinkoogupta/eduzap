import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar.jsx';
import SortButton from '../components/SortButton.jsx';
import Pagination from '../components/Pagination.jsx';
import RequestStats from '../components/RequestStats.jsx';
import RequestTable from '../components/RequestTable.jsx';

const Home = () => {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch requests based on page, sort, or search
  const fetchRequests = async (page = 1, order = sortOrder, query = searchTerm) => {
    try {
      let url = `http://localhost:4000/api/v1/requests/get?page=${page}&limit=5`;
      if (query && query.trim()) {
        url = `http://localhost:4000/api/v1/requests/search?title=${encodeURIComponent(query.trim())}&page=${page}&limit=5`;
      } else if (order && order !== 'asc') {
        url = `http://localhost:4000/api/v1/requests/sorted?order=${order}&page=${page}&limit=5`;
      }

      console.log('Fetching from:', url);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.success && result.data) {
        // Handle the correct API response structure
        setRequests(Array.isArray(result.data.items) ? result.data.items : []);
        setTotalPages(result.data.totalPages || 1);
        setCurrentPage(result.data.page || page);
      } else {
        throw new Error(result.error || 'Invalid response format');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setRequests([]);
      setTotalPages(1);
      alert(error.message || 'Failed to load requests. Please try again.');
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchRequests(1, 'asc', '');
  }, []); // Empty dependency array for one-time fetch

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on search
    fetchRequests(1, sortOrder, term);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1); // Reset to first page on clear
    fetchRequests(1, sortOrder, '');
  };

  // Handle sort
  const handleSort = (order) => {
    setSortOrder(order);
    setCurrentPage(1); // Reset to first page on sort
    fetchRequests(1, order, searchTerm);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchRequests(page, sortOrder, searchTerm);
  };

  // Handle delete
  const handleDelete = (id) => {
    // Optimistically remove from UI
    setRequests(requests.filter((req) => req._id !== id));
    // Refresh data from server
    fetchRequests(currentPage, sortOrder, searchTerm);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>EDUZAP LLP Request Dashboard</h1>
      <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
      <SortButton onSort={handleSort} />
      <RequestStats requests={requests} />
      <RequestTable requests={requests} onDelete={handleDelete} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default Home;