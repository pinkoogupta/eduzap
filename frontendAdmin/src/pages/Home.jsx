import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
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
import toast, { Toaster } from "react-hot-toast";

const Home = () => {
  // Initialize requests state with the expected API response structure
  const [requests, setRequests] = useState({
    data: { items: [], total: 0, page: 1, totalPages: 1 },
  });
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Setup websocket connection once
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";
    const socket = io(socketUrl, {
      transports: ["websocket"],
      withCredentials: true,
    });

    // On new request created elsewhere
    socket.on("request:created", (newRequest) => {
      setRequests((prev) => ({
        data: {
          ...prev.data,
          items: [newRequest, ...prev.data.items],
          total: (prev.data.total || 0) + 1,
        },
      }));
    });

    // On request deleted elsewhere
    socket.on("request:deleted", (payload) => {
      const deletedId = String(payload?.id ?? payload?._id ?? "");
      if (!deletedId) return;
      setRequests((prev) => ({
        data: {
          ...prev.data,
          items: prev.data.items.filter((req) => String(req._id) !== deletedId),
          total: Math.max(0, (prev.data.total || 0) - 1),
        },
      }));
    });

    return () => {
      socket.off("request:created");
      socket.off("request:deleted");
      socket.disconnect();
    };
  }, []);

  const loadRequests = async (page = 1, order = sortOrder, query = searchTerm) => {
    setLoading(true);
    try {
      let result;
      if (query) {
        result = await searchRequests(query, page);
      } else if (order) {
        result = await fetchSortedRequests(order, page);
      } else {
        result = await fetchRequests(page);
      }

      // Ensure the result is in the expected format
      setRequests({
        data: {
          items: result.data.items || [],
          total: result.data.total || 0,
          page: result.data.page || page,
          totalPages: result.data.totalPages || 1,
        },
      });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to load requests. Please try again.", {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setLoading(false);
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
    setLoading(true);
    try {
      await deleteRequest(id);
      toast.success("Request deleted successfully!", {
        duration: 3000,
        position: "top-right",
      });
      // Optimistically update the state to remove the deleted item
      setRequests((prev) => ({
        data: {
          ...prev.data,
          items: prev.data.items.filter((req) => req._id !== id),
          total: prev.data.total - 1,
        },
      }));
      // Reload to ensure consistency with the server
      loadRequests(requests.data.page, sortOrder, searchTerm);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to delete request. Please try again.", {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6">
      {/* Toast container */}
      <Toaster />

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

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center mb-8">
            <div className="w-12 h-12 border-4 border-t-purple-500 border-gray-300 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Stats */}
        {!loading && <RequestStats requests={requests} />}

        {/* Request List */}
        {!loading && <RequestList requests={requests} onDelete={handleDelete} />}

        {/* Pagination */}
        {!loading && (
          <Pagination
            currentPage={requests.data.page || 1}
            totalPages={requests.data.totalPages || 1}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Home;