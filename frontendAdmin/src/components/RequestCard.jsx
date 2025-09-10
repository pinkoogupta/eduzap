import React from "react";

const RequestCard = ({ request, onDelete }) => {
  const isRecent = new Date() - new Date(request.createdAt) < 60 * 60 * 1000;

  return (
    <div className="relative group">
      <div className={`absolute inset-0 bg-gradient-to-r ${isRecent ? 'from-yellow-400 to-orange-500' : 'from-purple-600 to-pink-600'} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition duration-300`}></div>
      <div className={`relative backdrop-blur-xl ${isRecent ? 'bg-white/10 border-yellow-400/30' : 'bg-white/5 border-white/10'} border rounded-2xl p-5 hover:transform hover:scale-105 transition-all duration-300`}>
        <div className="relative overflow-hidden rounded-xl mb-4">
          <img
            src={request.image || "https://via.placeholder.com/150"}
            alt={request.title}
            className="w-full h-48 object-cover transform group-hover:scale-110 transition duration-500"
          />
          {isRecent && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold animate-pulse">
              NEW
            </div>
          )}
        </div>
        <h2 className="text-xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {request.title}
        </h2>
        <div className="space-y-2 mb-4">
          <p className="text-purple-200 flex items-center gap-2">
            <span className="text-pink-400">📞</span> {request.phone}
          </p>
          <p className="text-white/80 font-medium flex items-center gap-2">
            <span className="text-purple-400">👤</span> {request.name}
          </p>
          <p className="text-purple-300/60 text-sm flex items-center gap-2">
            <span className="text-pink-400">🕐</span> {new Date(request.createdAt).toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => onDelete(request._id)}
          className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-pink-500/25"
        >
          Delete
        </button>
      </div>
    </div>
  );
};


export default RequestCard;
