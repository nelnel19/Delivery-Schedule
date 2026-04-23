// Orders.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterDate, setFilterDate] = useState('');

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

  const filteredOrders = filterDate 
    ? orders.filter(order => order.delivery_date === filterDate)
    : orders;

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h2>My Orders</h2>
      
      {selectedOrder ? (
        <div>
          <button onClick={() => setSelectedOrder(null)}>
            ← Back to Orders
          </button>
          
          <div>
            <h3>Order #{selectedOrder.id} Details</h3>
            <p><strong>Products:</strong></p>
            {selectedOrder.products && <p>{selectedOrder.products}</p>}
            {selectedOrder.products_file_path && (
              <p>
                <strong>Products File:</strong>{' '}
                <a href={`http://localhost:5000/${selectedOrder.products_file_path}`} target="_blank" rel="noopener noreferrer">
                  Download File
                </a>
              </p>
            )}
            <p><strong>Deliver To:</strong> {selectedOrder.deliver_to}</p>
            <p><strong>Delivery Date:</strong> {selectedOrder.delivery_date}</p>
            <p><strong>Additional Instructions:</strong></p>
            <p>{selectedOrder.additional_instructions || 'None'}</p>
            <p><strong>Created At:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
            
            {selectedOrder.status === 'delivered' && (
              <div>
                <h4>Delivery Information</h4>
                <p><strong>Driver:</strong> {selectedOrder.driver_name}</p>
                <p><strong>Delivered At:</strong> {new Date(selectedOrder.delivered_at).toLocaleString()}</p>
                <p><strong>Delivery Location:</strong> {selectedOrder.delivery_location_name}</p>
                <p><strong>Coordinates:</strong> {selectedOrder.delivery_latitude}, {selectedOrder.delivery_longitude}</p>
                <p><strong>Arrival Time:</strong> {new Date(selectedOrder.arrival_time).toLocaleString()}</p>
                <p><strong>Departure Time:</strong> {new Date(selectedOrder.departure_time).toLocaleString()}</p>
                <p><strong>Cheques Collected:</strong> {selectedOrder.cheques_collected ? 'Yes' : 'No'}</p>
                <p><strong>Additional Comment:</strong> {selectedOrder.additional_comment || 'None'}</p>
                <p>
                  <strong>View on Map:</strong>{' '}
                  <a 
                    href={`https://www.openstreetmap.org/?mlat=${selectedOrder.delivery_latitude}&mlon=${selectedOrder.delivery_longitude}#map=15/${selectedOrder.delivery_latitude}/${selectedOrder.delivery_longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Click here to see delivery location
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div>
            <label>Filter by Delivery Date: </label>
            <input 
              type="date" 
              value={filterDate} 
              onChange={(e) => setFilterDate(e.target.value)}
            />
            <button onClick={() => setFilterDate('')}>Clear Filter</button>
          </div>
          
          <h3>All Orders</h3>
          {filteredOrders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id}>
                <hr />
                <p><strong>Order #{order.id}</strong></p>
                <p><strong>Deliver To:</strong> {order.deliver_to}</p>
                <p><strong>Delivery Date:</strong> {order.delivery_date}</p>
                <p><strong>Created:</strong> {new Date(order.created_at).toLocaleString()}</p>
                {order.status === 'delivered' && (
                  <>
                    <p><strong>Driver:</strong> {order.driver_name}</p>
                    <p><strong>Delivered:</strong> {new Date(order.delivered_at).toLocaleString()}</p>
                    <p><strong>Cheques Collected:</strong> {order.cheques_collected ? 'Yes' : 'No'}</p>
                  </>
                )}
                <button onClick={() => setSelectedOrder(order)}>
                  View Details
                </button>
                <hr />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;