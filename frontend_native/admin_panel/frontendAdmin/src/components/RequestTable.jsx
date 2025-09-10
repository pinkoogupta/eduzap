import React from 'react';

const RequestTable = ({ requests, onDelete }) => {
  const isRecent = (createdAt) => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
    return new Date(createdAt) > oneHourAgo;
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/requests/del/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        onDelete(id); // Callback to refresh data in parent
        alert('Request deleted successfully');
      } else {
        alert('Failed to delete request');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting request');
    }
  };

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
      <thead>
        <tr style={{ backgroundColor: '#f2f2f2' }}>
          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Phone</th>
          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Title</th>
          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Image</th>
          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Timestamp</th>
          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Action</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((req) => (
          <tr
            key={req._id}
            style={{
              backgroundColor: isRecent(req.createdAt) ? '#fffacd' : 'white', // Highlight recent in light yellow
            }}
          >
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{req.name}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{req.phone}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{req.title}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
              {req.image ? (
                <img src={req.image} alt="Request" style={{ width: '100px', height: 'auto' }} />
              ) : (
                'No Image'
              )}
            </td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
              {new Date(req.createdAt).toLocaleString()}
            </td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
              <button
                onClick={() => handleDelete(req._id)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#ff4d4f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RequestTable;