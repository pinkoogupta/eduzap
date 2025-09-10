import React, { useState, useEffect } from "react";
import {
 fetchRequests,
 fetchSortedRequests,
 searchRequests,
 deleteRequest,
} from "../services/api.js";
import SearchBar from "../components/SearchBar.jsx";
import SortButton from "../components/SortButton.jsx";
import Pagination from "../components/Pagination.jsx";
import RequestStats from "../components/RequestStats.jsx";
import RequestList from "../components/RequestList.jsx";
import { Sparkles } from "lucide-react";

const Home = () => {
 const [requests, setRequests] = useState([]);
 const [currentPage, setCurrentPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);
 const [sortOrder, setSortOrder] = useState("asc");
 const [searchTerm, setSearchTerm] = useState("");

 const loadRequests = async (page = 1, order = sortOrder, query = searchTerm) => {
   try {
     let result;
     if (query) result = await searchRequests(query, page);
     else if (order) result = await fetchSortedRequests(order, page);
     else result = await fetchRequests(page);

     setRequests(result.data.items || result.data || []);
     setTotalPages(result.data.totalPages || 1);
     setCurrentPage(result.data.page || page);
   } catch (err) {
     console.error(err);
     alert(err.message);
   }
 };

 useEffect(() => {
   loadRequests();
 }, []);

 const handleSearch = (term) => {
   setSearchTerm(term);
   loadRequests(1, sortOrder, term);
 };

 const handleClearSearch = () => {
   setSearchTerm("");
   loadRequests(1, sortOrder, "");
 };

 const handleSort = (order) => {
   setSortOrder(order);
   loadRequests(1, order, searchTerm);
 };

 const handlePageChange = (page) => {
   loadRequests(page, sortOrder, searchTerm);
 };

 const handleDelete = async (id) => {
   await deleteRequest(id);
   loadRequests(currentPage, sortOrder, searchTerm);
 };

 return (
   <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6">
     {/* Animated background elements */}
     <div className="fixed inset-0 overflow-hidden pointer-events-none">
       <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
       <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
       <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
     </div>

     <div className="max-w-7xl mx-auto relative z-10">
       {/* Header */}
       <div className="text-center mb-12">
         <div className="flex items-center justify-center gap-3 mb-4">
           <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
             <Sparkles className="h-6 w-6 text-white" />
           </div>
           <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
             EDUZAP LLP
           </h1>
         </div>
         <p className="text-xl text-gray-300 font-light">Request Dashboard</p>
         <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
       </div>

       {/* Controls */}
       <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
         <div className="w-full md:flex-1">
           <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
         </div>
         <SortButton onSort={handleSort} />
       </div>

       {/* Stats */}
       <RequestStats requests={requests} />

       {/* Request List */}
       <RequestList requests={requests} onDelete={handleDelete} />

       {/* Pagination */}
       <Pagination 
         currentPage={currentPage} 
         totalPages={totalPages} 
         onPageChange={handlePageChange} 
       />
     </div>
   </div>
 );
};

export default Home;