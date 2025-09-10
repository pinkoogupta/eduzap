import React from 'react';

const RequestCard = ({ requests, onDelete }) => {
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
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
      {requests.map((req) => (
        <div
          key={req._id}
          style={{
            backgroundColor: isRecent(req.createdAt) ? '#fffacd' : 'white', // Highlight recent in light yellow
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            width: '300px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ margin: '0 0 10px' }}>{req.title}</h3>
          <p><strong>Name:</strong> {req.name}</p>
          <p><strong>Phone:</strong> {req.phone}</p>
          <p><strong>Timestamp:</strong> {new Date(req.createdAt).toLocaleString()}</p>
          <div>
            {req.image ? (
              <img src={req.image} alt="Request" style={{ width: '100%', height: 'auto', borderRadius: '4px', marginBottom: '10px' }} />
            ) : (
              <p>No Image</p>
            )}
          </div>
          <button
            onClick={() => handleDelete(req._id)}
            style={{
              padding: '8px 15px',
              backgroundColor: '#ff4d4f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default RequestCard;