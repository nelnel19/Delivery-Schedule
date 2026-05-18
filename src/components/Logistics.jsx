import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/logistics.css';

const Logistics = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
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

  const getFileExtension = (fileName) => {
    if (!fileName) return '';
    return fileName.split('.').pop().toLowerCase();
  };

  const getFileTypeLabel = (fileName) => {
    const ext = getFileExtension(fileName);
    const types = {
      'pdf': 'PDF',
      'xlsx': 'Excel',
      'xls': 'Excel',
      'docx': 'Word',
      'doc': 'Word',
      'jpg': 'Image',
      'jpeg': 'Image',
      'png': 'Image',
      'gif': 'Image',
      'mp4': 'Video',
      'mp3': 'Audio',
      'txt': 'Text',
      'csv': 'CSV'
    };
    return types[ext] || 'File';
  };

  const supportsPreview = (fileName) => {
    if (!fileName) return false;
    const ext = getFileExtension(fileName);
    const previewable = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'mp4', 'xlsx', 'xls', 'docx', 'doc', 'txt', 'csv'];
    return previewable.includes(ext);
  };

  const getPreviewEmbed = (fileUrl, fileName) => {
    if (!fileUrl || !fileName) return null;
    const ext = getFileExtension(fileName);
    
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
      return <img src={fileUrl} alt="Preview" className="preview-image" />;
    }
    
    if (ext === 'pdf') {
      return <iframe src={`${fileUrl}#toolbar=1`} title="PDF Preview" className="preview-iframe" />;
    }
    
    if (ext === 'mp4') {
      return <video controls className="preview-video"><source src={fileUrl} type="video/mp4" /></video>;
    }
    
    if (['xlsx', 'xls', 'docx', 'doc', 'txt', 'csv'].includes(ext)) {
      return <iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`} title="Document Preview" className="preview-iframe" />;
    }
    
    return null;
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="logistics-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="logistics-container">
      <div className="logistics-wrapper">
        <div className="logistics-header">
          <div>
            <div className="header-badge">Logistics Dashboard</div>
            <h1>Order Review</h1>
            <p>Review and manage delivery orders with file attachments</p>
          </div>
        </div>

        {selectedOrder ? (
          <div className="detail-view">
            <button onClick={closeModal} className="back-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Orders
            </button>

            <div className="detail-card">
              <div className="detail-card-header">
                <div>
                  <h2>Order #{selectedOrder._id?.toString().slice(-6)}</h2>
                  <p className="order-meta">Created {formatDateTime(selectedOrder.created_at)}</p>
                </div>
                {selectedOrder.additional_instructions && selectedOrder.additional_instructions.trim() && (
                  <div className="instruction-tag">Special Instruction</div>
                )}
              </div>

              <div className="detail-card-body">
                {selectedOrder.additional_instructions && selectedOrder.additional_instructions.trim() && (
                  <div className="instruction-section">
                    <div className="instruction-label">Special Instructions</div>
                    <p className="instruction-content">{selectedOrder.additional_instructions}</p>
                  </div>
                )}

                <div className="info-grid">
                  <div className="info-item">
                    <label>Deliver To</label>
                    <p>{selectedOrder.deliver_to || '-'}</p>
                  </div>
                  <div className="info-item">
                    <label>Delivery Date</label>
                    <p>{formatDate(selectedOrder.delivery_date)}</p>
                  </div>
                </div>

                {selectedOrder.products_file_url && (
                  <div className="file-section">
                    <div className="file-section-header">
                      <span className="file-label">Attached File</span>
                      <span className="file-type-badge">{getFileTypeLabel(selectedOrder.products_file_name)}</span>
                    </div>
                    <div className="file-info">
                      <span className="file-name">{selectedOrder.products_file_name || 'Unknown'}</span>
                    </div>
                    
                    {supportsPreview(selectedOrder.products_file_name) && (
                      <div className="preview-section">
                        <div className="preview-container">
                          {getPreviewEmbed(selectedOrder.products_file_url, selectedOrder.products_file_name)}
                        </div>
                      </div>
                    )}
                    
                    <div className="file-actions">
                      {supportsPreview(selectedOrder.products_file_name) && (
                        <a href={selectedOrder.products_file_url} target="_blank" rel="noopener noreferrer" className="btn-outline">
                          Open in New Tab
                        </a>
                      )}
                      <a href={selectedOrder.products_file_url} download={selectedOrder.products_file_name} className="btn-primary">
                        Download File
                      </a>
                    </div>
                  </div>
                )}

                {selectedOrder.delivered_at && (
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Delivered At</label>
                      <p>{formatDateTime(selectedOrder.delivered_at)}</p>
                    </div>
                    <div className="info-item">
                      <label>Driver</label>
                      <p>{selectedOrder.driver_name || '-'}</p>
                    </div>
                    <div className="info-item">
                      <label>Delivery Location</label>
                      <p>{selectedOrder.delivery_location_name || '-'}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="detail-card-footer">
                <button onClick={closeModal} className="btn-secondary">Close</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="list-view">
            <div className="filters-bar">
              <div className="filters-grid">
                <div className="filter-field">
                  <label>Delivery Date</label>
                  <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="filter-input" />
                </div>
                <div className="filter-field">
                  <label>Special Instruction</label>
                  <select value={hasInstructionFilter} onChange={(e) => setHasInstructionFilter(e.target.value)} className="filter-select">
                    <option value="all">All Orders</option>
                    <option value="has">Has Instruction</option>
                    <option value="no">No Instruction</option>
                  </select>
                </div>
                <div className="filter-field">
                  <label>File Attachment</label>
                  <select value={hasFileFilter} onChange={(e) => setHasFileFilter(e.target.value)} className="filter-select">
                    <option value="all">All Orders</option>
                    <option value="has">Has File</option>
                    <option value="no">No File</option>
                  </select>
                </div>
                <div className="filter-actions">
                  <button onClick={() => { setFilterDate(''); setHasInstructionFilter('all'); setHasFileFilter('all'); }} className="btn-clear">
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            <div className="orders-header-bar">
              <div className="results-count">{filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}</div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <h3>No orders found</h3>
                <p>Try adjusting your filters</p>
              </div>
            ) : (
              <div className="orders-table">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Deliver To</th>
                      <th>Delivery Date</th>
                      <th>File</th>
                      <th>Special Instruction</th>
                      <th>Created</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      const hasInstruction = order.additional_instructions && order.additional_instructions.trim() !== '';
                      const hasFile = !!order.products_file_url;
                      
                      return (
                        <tr key={order._id} className={hasInstruction ? 'has-instruction' : ''} onClick={() => setSelectedOrder(order)}>
                          <td className="order-id-cell">#{order._id?.toString().slice(-6)}</td>
                          <td>{order.deliver_to}</td>
                          <td>{formatDate(order.delivery_date)}</td>
                          <td className="file-cell">
                            {hasFile ? (
                              <span className="file-badge">{getFileTypeLabel(order.products_file_name)}</span>
                            ) : (
                              <span className="no-file">—</span>
                            )}
                          </td>
                          <td className="instruction-cell">
                            {hasInstruction ? (
                              <span className="instruction-badge">Yes</span>
                            ) : (
                              <span className="no-instruction">—</span>
                            )}
                          </td>
                          <td>{formatDate(order.created_at)}</td>
                          <td className="action-cell">
                            <button className="view-button">Review</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Logistics;