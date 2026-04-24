import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('https://deltaplus-delivery-schedule-backend.onrender.com/api/orders/all');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    let matchesDate = true;
    let matchesStatus = true;
    
    if (filterDate) {
      matchesDate = order.delivery_date === filterDate;
    }
    if (statusFilter !== 'all') {
      matchesStatus = order.status === statusFilter;
    }
    
    return matchesDate && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'delivered':
        return 'status-delivered';
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      default:
        return 'status-default';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        );
      case 'pending':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-card">
        <div className="orders-header">
          <div className="header-badge">
            <span>Order Management</span>
          </div>
          <h2>My Orders</h2>
          <p>Track and manage all your delivery orders in one place</p>
        </div>

        {selectedOrder ? (
          <div className="order-details-view">
            <button onClick={() => setSelectedOrder(null)} className="back-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Orders
            </button>

            <div className="order-details-card">
              <div className="order-details-header">
                <h3>Order #{selectedOrder.id}</h3>
                <span className={`status-badge ${getStatusBadgeClass(selectedOrder.status)}`}>
                  {getStatusIcon(selectedOrder.status)}
                  {selectedOrder.status?.toUpperCase()}
                </span>
              </div>

              <div className="order-details-content">
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

                <div className="details-section">
                  <h4>Products Information</h4>
                  {selectedOrder.products && (
                    <div className="detail-item">
                      <label>Products List</label>
                      <p className="products-text">{selectedOrder.products}</p>
                    </div>
                  )}
                  {selectedOrder.products_file_path && (
                    <div className="detail-item">
                      <label>Products File</label>
                      <a 
                        href={`http://localhost:5000/${selectedOrder.products_file_path}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="download-link"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 4v12m-4-4l4 4 4-4" />
                          <path d="M4 16v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
                        </svg>
                        Download File
                      </a>
                    </div>
                  )}
                </div>

                {selectedOrder.additional_instructions && (
                  <div className="details-section">
                    <h4>Additional Instructions</h4>
                    <p className="instructions-text">{selectedOrder.additional_instructions}</p>
                  </div>
                )}

                {selectedOrder.status === 'delivered' && (
                  <div className="details-section delivery-info">
                    <h4>Delivery Information</h4>
                    <div className="details-grid">
                      <div className="detail-item">
                        <label>Driver Name</label>
                        <p>{selectedOrder.driver_name}</p>
                      </div>
                      <div className="detail-item">
                        <label>Delivered At</label>
                        <p>{new Date(selectedOrder.delivered_at).toLocaleString()}</p>
                      </div>
                      <div className="detail-item">
                        <label>Delivery Location</label>
                        <p>{selectedOrder.delivery_location_name}</p>
                      </div>
                      <div className="detail-item">
                        <label>Arrival Time</label>
                        <p>{new Date(selectedOrder.arrival_time).toLocaleString()}</p>
                      </div>
                      <div className="detail-item">
                        <label>Departure Time</label>
                        <p>{new Date(selectedOrder.departure_time).toLocaleString()}</p>
                      </div>
                      <div className="detail-item">
                        <label>Cheques Collected</label>
                        <p className={selectedOrder.cheques_collected ? 'yes-text' : 'no-text'}>
                          {selectedOrder.cheques_collected ? 'Yes' : 'No'}
                        </p>
                      </div>
                      {selectedOrder.additional_comment && (
                        <div className="detail-item full-width">
                          <label>Additional Comment</label>
                          <p>{selectedOrder.additional_comment}</p>
                        </div>
                      )}
                      <div className="detail-item full-width">
                        <label>Coordinates</label>
                        <p>{selectedOrder.delivery_latitude}, {selectedOrder.delivery_longitude}</p>
                      </div>
                      <div className="detail-item full-width">
                        <a 
                          href={`https://www.openstreetmap.org/?mlat=${selectedOrder.delivery_latitude}&mlon=${selectedOrder.delivery_longitude}#map=15/${selectedOrder.delivery_latitude}/${selectedOrder.delivery_longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="map-link"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          View on Map
                        </a>
                      </div>
                    </div>
                  </div>
                )}
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
                      <path d="M20 7L9 18L4 13" />
                    </svg>
                    Status
                  </label>
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>

                <button onClick={() => {
                  setFilterDate('');
                  setStatusFilter('all');
                }} className="clear-filters-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4v4h4M20 20v-4h-4" />
                    <path d="M4 20l16-16" />
                  </svg>
                  Clear Filters
                </button>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <h4>No orders found</h4>
                <p>Try adjusting your filters or create a new order</p>
              </div>
            ) : (
              <div className="orders-grid">
                {filteredOrders.map(order => (
                  <div key={order.id} className="order-card" onClick={() => setSelectedOrder(order)}>
                    <div className="order-card-header">
                      <div className="order-id">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 7L9 18L4 13" />
                        </svg>
                        <span>Order #{order.id}</span>
                      </div>
                      <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
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

                      {order.status === 'delivered' && (
                        <div className="delivery-summary">
                          <div className="summary-row">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>{order.driver_name}</span>
                          </div>
                          <div className="summary-row">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                            <span>Cheques: {order.cheques_collected ? 'Yes' : 'No'}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="order-card-footer">
                      <button className="view-details-btn">
                        View Details
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;