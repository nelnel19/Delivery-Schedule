import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Logistics = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [message, setMessage] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('https://deltaplus-delivery-schedule-backend.onrender.com/api/orders/all');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setMessage('Failed to load orders');
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return '📄';
    const ext = fileName.split('.').pop().toLowerCase();
    const icons = {
      'xlsx': '📊',
      'xls': '📊',
      'pdf': '📑',
      'doc': '📝',
      'docx': '📝',
      'txt': '📃',
      'csv': '📈',
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'png': '🖼️',
      'gif': '🖼️',
      'mp4': '🎥',
      'mp3': '🎵',
      'zip': '📦',
      'rar': '📦'
    };
    return icons[ext] || '📄';
  };

  // Get preview URL for any file type
  const getPreviewUrl = (fileUrl, fileName) => {
    if (!fileUrl || !fileName) return null;
    
    const ext = fileName.split('.').pop().toLowerCase();
    
    // Images - direct view
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) {
      return fileUrl;
    }
    
    // PDF - direct view
    if (ext === 'pdf') {
      return fileUrl;
    }
    
    // Videos - direct view
    if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) {
      return fileUrl;
    }
    
    // Audio files
    if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) {
      return fileUrl;
    }
    
    // Excel, Word, PowerPoint, Text files - Use Google Docs Viewer
    if (['xlsx', 'xls', 'docx', 'doc', 'pptx', 'ppt', 'txt', 'csv', 'rtf'].includes(ext)) {
      return `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
    }
    
    // For other files, return null (will show download option)
    return null;
  };

  // Check if file type supports preview
  const supportsPreview = (fileName) => {
    if (!fileName) return false;
    const ext = fileName.split('.').pop().toLowerCase();
    const previewable = [
      'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', // Images
      'pdf', // PDF
      'mp4', 'webm', 'ogg', 'mov', // Videos
      'mp3', 'wav', 'ogg', 'm4a', // Audio
      'xlsx', 'xls', 'docx', 'doc', 'pptx', 'ppt', 'txt', 'csv', 'rtf' // Documents
    ];
    return previewable.includes(ext);
  };

  // Get appropriate embed/player HTML
  const getFileEmbed = (fileUrl, fileName) => {
    if (!fileUrl || !fileName) return null;
    
    const ext = fileName.split('.').pop().toLowerCase();
    
    // Images
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) {
      return (
        <img 
          src={fileUrl} 
          alt="File preview"
          style={{ 
            maxWidth: '100%', 
            maxHeight: '500px', 
            objectFit: 'contain',
            borderRadius: '4px'
          }}
        />
      );
    }
    
    // PDF
    if (ext === 'pdf') {
      return (
        <iframe
          src={`${fileUrl}#toolbar=1&navpanes=1`}
          title="PDF Preview"
          style={{ 
            width: '100%', 
            height: '600px', 
            border: 'none',
            borderRadius: '4px'
          }}
        />
      );
    }
    
    // Videos
    if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) {
      return (
        <video 
          controls 
          style={{ width: '100%', maxHeight: '500px', borderRadius: '4px' }}
          controlsList="nodownload"
        >
          <source src={fileUrl} type={`video/${ext}`} />
          Your browser does not support the video tag.
        </video>
      );
    }
    
    // Audio
    if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) {
      return (
        <audio 
          controls 
          style={{ width: '100%', borderRadius: '4px' }}
          controlsList="nodownload"
        >
          <source src={fileUrl} type={`audio/${ext}`} />
          Your browser does not support the audio tag.
        </audio>
      );
    }
    
    // Documents (Excel, Word, PowerPoint, Text) - Use Google Docs Viewer
    if (['xlsx', 'xls', 'docx', 'doc', 'pptx', 'ppt', 'txt', 'csv', 'rtf'].includes(ext)) {
      return (
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
          title="Document Preview"
          style={{ 
            width: '100%', 
            height: '600px', 
            border: 'none',
            borderRadius: '4px'
          }}
          onError={() => setPreviewLoading(false)}
        />
      );
    }
    
    return null;
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading orders...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Logistics Dashboard - Order Review</h2>
      
      {message && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              textAlign: 'left'
            }}>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Order ID</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Deliver To</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Delivery Date</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>File</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Special Instruction</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Created At</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const hasSpecialInstruction = order.additional_instructions && order.additional_instructions.trim() !== '';
              const hasFile = order.products_file_url;
              return (
                <tr 
                  key={order._id}
                  style={{
                    backgroundColor: hasSpecialInstruction ? '#ffcccc' : 'transparent',
                    borderBottom: '1px solid #ddd'
                  }}
                >
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>#{order._id.toString().slice(-6)}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{order.deliver_to}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {new Date(order.delivery_date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {hasFile ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 8px',
                        backgroundColor: '#e3f2fd',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        <span>{getFileIcon(order.products_file_name)}</span>
                        {order.products_file_name?.substring(0, 30)}
                        {order.products_file_name?.length > 30 ? '...' : ''}
                      </span>
                    ) : (
                      <span style={{ color: '#999' }}>No file</span>
                    )}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {hasSpecialInstruction ? (
                      <span style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        display: 'inline-block'
                      }}>
                        ⚠️ HAS SPECIAL INSTRUCTION
                      </span>
                    ) : (
                      <span style={{ color: '#999' }}>No special instruction</span>
                    )}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <button
                      onClick={() => handleViewDetails(order)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: hasSpecialInstruction ? '#dc3545' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {hasSpecialInstruction ? 'Read Instruction' : 'View Details'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '40px' }}>No orders found</p>
      )}

      {/* Modal for viewing order details with universal file preview */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }} onClick={closeModal}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '1000px',
            width: '90%',
            maxHeight: '90%',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h3>Order Details #{selectedOrder._id.toString().slice(-6)}</h3>
            
            {selectedOrder.additional_instructions && selectedOrder.additional_instructions.trim() !== '' && (
              <div style={{
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#ffcccc',
                borderRadius: '8px',
                border: '2px solid #dc3545'
              }}>
                <div style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  padding: '8px',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  marginBottom: '10px'
                }}>
                  ⚠️ HAS SPECIAL INSTRUCTION ⚠️
                </div>
                <strong style={{ color: '#dc3545' }}>Special Instruction:</strong>
                <p style={{ marginTop: '10px', fontSize: '16px' }}>
                  {selectedOrder.additional_instructions}
                </p>
              </div>
            )}

            <div style={{ marginTop: '20px' }}>
              <p><strong>Deliver To:</strong> {selectedOrder.deliver_to}</p>
              <p><strong>Delivery Date:</strong> {new Date(selectedOrder.delivery_date).toLocaleDateString()}</p>
              <p><strong>Created At:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
              
              {/* Universal File Preview Section */}
              {selectedOrder.products_file_url && (
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6'
                }}>
                  <strong style={{ fontSize: '16px' }}>📎 Attached File:</strong>
                  <div style={{ marginTop: '10px' }}>
                    <p><strong>File Name:</strong> {selectedOrder.products_file_name || 'Unknown'}</p>
                    <p><strong>File Type:</strong> {selectedOrder.products_file_type || 'Unknown'}</p>
                    
                    {/* File Preview */}
                    {supportsPreview(selectedOrder.products_file_name) ? (
                      <div style={{ marginTop: '15px' }}>
                        <strong>Preview:</strong>
                        <div style={{ 
                          marginTop: '10px', 
                          border: '1px solid #ddd', 
                          borderRadius: '4px',
                          overflow: 'hidden',
                          backgroundColor: '#fff',
                          minHeight: '200px'
                        }}>
                          {getFileEmbed(selectedOrder.products_file_url, selectedOrder.products_file_name)}
                        </div>
                      </div>
                    ) : (
                      <div style={{ 
                        marginTop: '15px', 
                        padding: '30px', 
                        backgroundColor: '#e9ecef', 
                        borderRadius: '4px',
                        textAlign: 'center'
                      }}>
                        <p style={{ fontSize: '48px', margin: '0 0 10px 0' }}>📄</p>
                        <p><strong>Preview not available for this file type</strong></p>
                        <p>Please download the file to view it.</p>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {supportsPreview(selectedOrder.products_file_name) && (
                        <a
                          href={getPreviewUrl(selectedOrder.products_file_url, selectedOrder.products_file_name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            display: 'inline-block'
                          }}
                        >
                          🔗 Open in New Tab
                        </a>
                      )}
                      <a
                        href={selectedOrder.products_file_url}
                        download={selectedOrder.products_file_name}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '4px',
                          display: 'inline-block'
                        }}
                      >
                        ⬇️ Download File
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              {!selectedOrder.products_file_url && (
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '4px',
                  marginTop: '15px',
                  borderLeft: '4px solid #6c757d'
                }}>
                  <strong>No file attached</strong>
                  <p style={{ marginTop: '10px' }}>This order has no file attachment.</p>
                </div>
              )}

              {selectedOrder.delivered_at && (
                <>
                  <p><strong>Delivered At:</strong> {new Date(selectedOrder.delivered_at).toLocaleString()}</p>
                  <p><strong>Driver:</strong> {selectedOrder.driver_name}</p>
                  <p><strong>Delivery Location:</strong> {selectedOrder.delivery_location_name}</p>
                </>
              )}
            </div>
            
            <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={closeModal}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logistics;