import React from 'react';

const RequestStats = ({ requests }) => {
  // Total requests
  const totalRequests = requests.length;

  // Today's requests (assuming 'createdAt' is a date string in each request)
  const today = new Date().setHours(0, 0, 0, 0); // Start of today
  const todaysRequests = requests.filter((req) => new Date(req.createdAt).getTime() >= today).length;

  // Duplicate title statistics
  const titleCounts = requests.reduce((acc, req) => {
    const title = req.title;
    acc[title] = (acc[title] || 0) + 1;
    return acc;
  }, {});
  const duplicates = Object.entries(titleCounts)
    .filter(([_, count]) => count > 1)
    .map(([title, count]) => `${title}: ${count} requests`)
    .join(', ') || 'No duplicates';

  return (
    <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Request Statistics</h3>
      <p>Total Requests: {totalRequests}</p>
      <p>Today's Requests: {todaysRequests}</p>
      <p>Duplicate Titles: {duplicates}</p>
    </div>
  );
};

export default RequestStats;