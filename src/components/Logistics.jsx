import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/logistics.css';

const Logistics = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [message, setMessage] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [hasInstructionFilter, setHasInstructionFilter] = useState('all');
  const [hasFileFilter, setHasFileFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
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

  const filteredOrders = orders.filter(order => {
    let matchesDate = true;
    let matchesInstruction = true;
    let matchesFile = true;
    
    if (filterDate) {
      matchesDate = order.delivery_date === filterDate;
    }
    if (hasInstructionFilter !== 'all') {
      const hasInstruction = order.additional_instructions && order.additional_instructions.trim() !== '';
      matchesInstruction = hasInstructionFilter === 'has' ? hasInstruction : !hasInstruction;
    }
    if (hasFileFilter !== 'all') {
      const hasFile = !!order.products_file_url;
      matchesFile = hasFileFilter === 'has' ? hasFile : !hasFile;
    }
    
    return matchesDate && matchesInstruction && matchesFile;
  });

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

  const supportsPreview = (fileName) => {
    if (!fileName) return false;
    const ext = fileName.split('.').pop().toLowerCase();
    const previewable = [
      'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg',
      'pdf', 'mp4', 'webm', 'ogg', 'mov',
      'mp3', 'wav', 'ogg', 'm4a',
      'xlsx', 'xls', 'docx', 'doc', 'pptx', 'ppt', 'txt', 'csv', 'rtf'
    ];
    return previewable.includes(ext);
  };

  const getFileEmbed = (fileUrl, fileName) => {
    if (!fileUrl || !fileName) return null;
    
    const ext = fileName.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) {
      return (
        <img 
          src={fileUrl} 
          alt="File preview"
          className="file-preview-image"
        />
      );
    }
    
    if (ext === 'pdf') {
      return (
        <iframe
          src={`${fileUrl}#toolbar=1&navpanes=1`}
          title="PDF Preview"
          className="file-preview-iframe"
        />
      );
    }
    
    if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) {
      return (
        <video 
          controls 
          className="file-preview-video"
          controlsList="nodownload"
        >
          <source src={fileUrl} type={`video/${ext}`} />
          Your browser does not support the video tag.
        </video>
      );
    }
    
    if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) {
      return (
        <audio 
          controls 
          className="file-preview-audio"
          controlsList="nodownload"
        >
          <source src={fileUrl} type={`audio/${ext}`} />
          Your browser does not support the audio tag.
        </audio>
      );
    }
    
    if (['xlsx', 'xls', 'docx', 'doc', 'pptx', 'ppt', 'txt', 'csv', 'rtf'].includes(ext)) {
      return (
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
          title="Document Preview"
          className="file-preview-iframe"
        />
      );
    }
    
    return null;
  };

  const getPreviewUrl = (fileUrl, fileName) => {
    if (!fileUrl || !fileName) return null;
    const ext = fileName.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'pdf', 'mp4', 'webm', 'ogg', 'mov', 'mp3', 'wav', 'm4a'].includes(ext)) {
      return fileUrl;
    }
    
    if (['xlsx', 'xls', 'docx', 'doc', 'pptx', 'ppt', 'txt', 'csv', 'rtf'].includes(ext)) {
      return `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
    }
    
    return null;
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="logistics-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="logistics-container">
      <div className="logistics-card">
        <div className="logistics-header">
          <div className="header-badge">
            <span>Logistics Dashboard</span>
          </div>
          <h2>Order Review</h2>
          <p>Review and manage all delivery orders with file attachments</p>
        </div>

        {selectedOrder ? (
          <div className="order-details-view">
            <button onClick={closeModal} className="back-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Orders
            </button>

            <div className="order-details-card">
              <div className="order-details-header">
                <h3>Order #{selectedOrder._id?.toString().slice(-6)}</h3>
                {selectedOrder.additional_instructions && selectedOrder.additional_instructions.trim() !== '' && (
                  <span className="instruction-badge">
                    ⚠️ Has Instruction
                  </span>
                )}
              </div>

              <div className="order-details-content">
                {selectedOrder.additional_instructions && selectedOrder.additional_instructions.trim() !== '' && (
                  <div className="instruction-alert">
                    <div className="instruction-alert-header">
                      ⚠️ SPECIAL INSTRUCTION
                    </div>
                    <p className="instruction-text">{selectedOrder.additional_instructions}</p>
                  </div>
                )}

                <div className="details-section">
                  <h4>Order Information</h4>
                  <div className="details-grid">
                    <div className="detail-item">
                      <label>Deliver To</label>
                      <p>{selectedOrder.deliver_to}</p>
                    </div>
                    <div className="detail-item">
                      <label>Delivery Date</label>
                      <p>{new Date(selectedOrder.delivery_date).toLocaleDateString()}</p>
                    </div>
                    <div className="detail-item">
                      <label>Created At</label>
                      <p>{new Date(selectedOrder.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {selectedOrder.products_file_url && (
                  <div className="details-section">
                    <h4>Attached File</h4>
                    <div className="file-info">
                      <div className="file-name">
                        <span className="file-icon">{getFileIcon(selectedOrder.products_file_name)}</span>
                        <span>{selectedOrder.products_file_name || 'Unknown'}</span>
                      </div>
                      <p className="file-type">File Type: {selectedOrder.products_file_type || 'Unknown'}</p>
                      
                      {supportsPreview(selectedOrder.products_file_name) && (
                        <div className="file-preview">
                          <strong>Preview:</strong>
                          <div className="preview-container">
                            {getFileEmbed(selectedOrder.products_file_url, selectedOrder.products_file_name)}
                          </div>
                        </div>
                      )}
                      
                      {!supportsPreview(selectedOrder.products_file_name) && (
                        <div className="preview-not-available">
                          <p>📄</p>
                          <p><strong>Preview not available for this file type</strong></p>
                          <p>Please download the file to view it.</p>
                        </div>
                      )}
                      
                      <div className="file-actions">
                        {supportsPreview(selectedOrder.products_file_name) && (
                          <a
                            href={getPreviewUrl(selectedOrder.products_file_url, selectedOrder.products_file_name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="preview-link"
                          >
                            🔗 Open in New Tab
                          </a>
                        )}
                        <a
                          href={selectedOrder.products_file_url}
                          download={selectedOrder.products_file_name}
                          className="download-link"
                        >
                          ⬇️ Download File
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {!selectedOrder.products_file_url && (
                  <div className="details-section">
                    <div className="no-file-alert">
                      <strong>No file attached</strong>
                      <p>This order has no file attachment.</p>
                    </div>
                  </div>
                )}

                {selectedOrder.delivered_at && (
                  <div className="details-section">
                    <h4>Delivery Information</h4>
                    <div className="details-grid">
                      <div className="detail-item">
                        <label>Delivered At</label>
                        <p>{new Date(selectedOrder.delivered_at).toLocaleString()}</p>
                      </div>
                      <div className="detail-item">
                        <label>Driver</label>
                        <p>{selectedOrder.driver_name}</p>
                      </div>
                      <div className="detail-item">
                        <label>Delivery Location</label>
                        <p>{selectedOrder.delivery_location_name}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
                <button onClick={closeModal} className="close-modal-btn">
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="orders-list-view">
            <div className="filters-section">
              <div className="filters-header">
                <h3>All Orders</h3>
                <p>{filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found</p>
              </div>
              
              <div className="filters-grid">
                <div className="filter-group">
                  <label>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    Delivery Date
                  </label>
                  <input 
                    type="date" 
                    value={filterDate} 
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="filter-input"
                  />
                </div>

                <div className="filter-group">
                  <label>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 8v4l3 3M12 2a10 10 0 1 0 10 10" />
                    </svg>
                    Special Instruction
                  </label>
                  <select 
                    value={hasInstructionFilter} 
                    onChange={(e) => setHasInstructionFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Orders</option>
                    <option value="has">Has Instruction</option>
                    <option value="no">No Instruction</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                      <polyline points="13 2 13 9 20 9" />
                    </svg>
                    File Attachment
                  </label>
                  <select 
                    value={hasFileFilter} 
                    onChange={(e) => setHasFileFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Orders</option>
                    <option value="has">Has File</option>
                    <option value="no">No File</option>
                  </select>
                </div>

                <button onClick={() => {
                  setFilterDate('');
                  setHasInstructionFilter('all');
                  setHasFileFilter('all');
                }} className="clear-filters-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4v4h4M20 20v-4h-4" />
                    <path d="M4 20l16-16" />
                  </svg>
                  Clear Filters
                </button>
              </div>
            </div>

            {message && (
              <div className="message-alert">
                {message}
              </div>
            )}

            {filteredOrders.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <h4>No orders found</h4>
                <p>Try adjusting your filters</p>
              </div>
            ) : (
              <div className="orders-grid">
                {filteredOrders.map((order) => {
                  const hasSpecialInstruction = order.additional_instructions && order.additional_instructions.trim() !== '';
                  const hasFile = !!order.products_file_url;
                  
                  return (
                    <div 
                      key={order._id} 
                      className={`order-card ${hasSpecialInstruction ? 'has-instruction' : ''}`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="order-card-header">
                        <div className="order-id">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 7L9 18L4 13" />
                          </svg>
                          <span>Order #{order._id?.toString().slice(-6)}</span>
                        </div>
                        {hasSpecialInstruction && (
                          <span className="instruction-tag">⚠️ Instruction</span>
                        )}
                      </div>

                      <div className="order-card-body">
                        <div className="order-info">
                          <div className="info-row">
                            <label>Deliver To:</label>
                            <p>{order.deliver_to}</p>
                          </div>
                          <div className="info-row">
                            <label>Delivery Date:</label>
                            <p>{new Date(order.delivery_date).toLocaleDateString()}</p>
                          </div>
                          <div className="info-row">
                            <label>Created:</label>
                            <p>{new Date(order.created_at).toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="order-summary">
                          {hasFile && (
                            <div className="summary-row">
                              <span className="summary-icon">📎</span>
                              <span className="summary-text">
                                {order.products_file_name?.substring(0, 40)}
                                {order.products_file_name?.length > 40 ? '...' : ''}
                              </span>
                            </div>
                          )}
                          {hasSpecialInstruction && (
                            <div className="summary-row instruction-summary">
                              <span className="summary-icon">⚠️</span>
                              <span className="summary-text instruction-preview">
                                {order.additional_instructions.substring(0, 60)}
                                {order.additional_instructions.length > 60 ? '...' : ''}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="order-card-footer">
                        <button className="view-details-btn">
                          Review Order
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Logistics;