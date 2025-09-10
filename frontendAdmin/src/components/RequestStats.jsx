import React from "react";

const RequestStats = ({ requests }) => {
  const items = requests?.data?.items || [];
  const total = requests?.data?.total || items.length;
  const today = items.filter(
    (r) => new Date(r.createdAt).toDateString() === new Date("2025-09-10").toDateString()
  ).length;

  const titleCounts = items.reduce((acc, r) => {
    acc[r.title] = (acc[r.title] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-50"></div>
      <div className="relative bg-black/30 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {total}
            </p>
            <p className="text-purple-200 mt-2">Total Requests</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              {today}
            </p>
            <p className="text-purple-200 mt-2">Today's Requests</p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <h3 className="font-semibold text-pink-400 mb-3">Duplicate Titles:</h3>
            <ul className="space-y-1">
              {Object.entries(titleCounts).map(([title, count]) =>
                count > 1 ? (
                  <li key={title} className="text-purple-200 text-sm flex items-center gap-2">
                    <span className="text-pink-400">•</span> {title}: 
                    <span className="font-bold text-white">{count}</span>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestStats;