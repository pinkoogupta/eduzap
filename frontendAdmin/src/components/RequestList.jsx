import React from "react";
import RequestCard from "./RequestCard.jsx";

const RequestList = ({ requests, onDelete }) => {
  const items = requests?.data?.items || [];

  if (!items.length) {
    return (
      <div className="text-center py-12">
        <div className="inline-block p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl backdrop-blur-xl border border-white/10">
          <p className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold">
            No requests found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
      {items.map((req) => (
        <RequestCard key={req._id} request={req} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default RequestList;