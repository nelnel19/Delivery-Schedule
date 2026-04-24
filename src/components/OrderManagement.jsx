import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ordermanagement.css';

const businessNames = [
  "2RM WORTHY INDUSTRIAL SUPPLIES",
  "3G1B ENTERPRISE",
  "3J GOLDEN DRAGON CORP",
  "3K SAFETY SUPPLIES OPC",
  "5MLINK ENTERPRISE",
  "A. ALVAREZ TRADING & SERVICES",
  "AFFF GENERAL MERCHANDISE",
  "AGP TRADING",
  "AJDA ENTERPRISES INC.",
  "AJDA INDUSTRIAL SUPPLY",
  "AKJ27 CONSTRUCTION SUPPLY AND",
  "ALPHA SOLUTIO ENTERPRISE",
  "AMCAS ENTERPRISES",
  "AMMCO INTERNATIONAL CONSUMER",
  "ANDUILLER INT'L. SALES CORP",
  "AQUARIAN MARINE SUPPLY INC.",
  "ARC-CARE ENTERPRISES",
  "ARUGA INTEGRATED SOLUTION OPC",
  "BC-MAN ENTERPRISES INC.",
  "BEMX ENTERPRISES",
  "BESTMARC UNISALES INC.",
  "BIGVISION INTERNATIONAL TRADE",
  "BLUEPOWER VENTURES INC.",
  "BOHOL QUALITY CORPORATION",
  "BUENDEZ INDUSTRIAL",
  "BUILDSAFE MARKETING VENTURES",
  "CEBU ATLANTIC HARDWARE INC.",
  "CEBU BELMONT, INC",
  "CLEANGUARD JANITORIAL &",
  "COMFORT SEARCH ENTERPRISES",
  "COMPLIMENTS MEN'S BOUTIQUE",
  "CORAND SUPPORT MARKETING INC",
  "CS TRADING & GENERAL",
  "DC INDUSTRIAL & OFFICE",
  "DCM GLOBAL TECHNOLOGIES INC.",
  "DELS APPAREL CORPORATION",
  "DELS CORPORATION",
  "DELTA PLUS PHILIPPINES",
  "DENKI ELECTRIC CORPORATION",
  "DML SUBIC FREEPORT CORPORATION",
  "EHS BIOPRODUCTS INC",
  "ELITECLEAN INC",
  "ENBK PRINTING SERVICES",
  "FIL AMERICAN HARDWARE",
  "FIRST CHOICE INDUSTRIAL SAFETY",
  "FIRST POWER ELECTRICAL",
  "FOOTSAFE PHILIPPINES, INC.",
  "FORD GARMENTS AND SAFETY GEARS",
  "FOREMOST SCREWTECH BOLTS",
  "FRONTGUILD INC.",
  "GDA SEMICON TRADING",
  "GEN ASIA TRADING",
  "GENASCO MARKETING CORPORATION",
  "GLJM DIVERSIFIED",
  "GLOTOC TOOLS AND INDUSTRIAL",
  "GOSHIELD PROTECTIVE EQUIPMENT",
  "GOSON MARKETING INC.",
  "GPL TRADING OPC",
  "GRATEFUL MIND ENTERPRISE",
  "GREMCA-V INTERNATIONAL",
  "HANANI CONSUMER GOODS TRADING",
  "HONEY-WELL INTERNATIONAL SALES",
  "INTEGRATED SCIENTIFIC AND",
  "J. RANIDO ENTERPRISES",
  "JCC3 TRADING CORPORATION",
  "JEZHAN ENTERPRISES",
  "JV SAFETY AND PERSONAL",
  "KAZ TRADING",
  "KEY LINK SALES INTEGRATED INC.",
  "KING'S SAFETYNET INC.",
  "KJELD ENTERPRISE INC.",
  "LATEX ENTERPRISES",
  "LJM INDUSTRIAL SAFETY PRODUCTS",
  "LOCSEAL INDUSTRIAL CORPORATION",
  "LSG INDUSTRIAL & OFFICE",
  "MAJIN INDUSTRIAL",
  "MANWORXXX MARKETING AND",
  "MARKETING EVENT",
  "MASE PERSONAL PROTECTIVE",
  "MASIGASIG DISTRIBUTION",
  "MBN ENTERPRISE",
  "MC ARC INDUSTRIAL SUPPLY",
  "MERCHANTO ENTERPRISES CORP.",
  "MERF ISES OPC",
  "MICEL CORPORATION",
  "MILERK CONSUMER GOODS TRADING",
  "MOIKAI INCORPORATED",
  "MOIKAI INDUSTRIAL SUPPLIES AND",
  "MUSH ENTERPRISES",
  "NEMIKA ENTERPRISES",
  "NORDEN SUBIC ENTREPRENEURS INC",
  "NUPON TECHNOLOGY PHILIPPINES",
  "OCCUPATIONAL SAFETY AND HEALTH",
  "OLIVEROS PROTECTIVE EQUIPMENT",
  "OPTICHEM INDUSTRIES CHEMICAL",
  "ORIGIN8 BUILDERS & TRADING INC",
  "ORO FORMMS TRADING",
  "PHILSTAFF MANAGEMENT SERVICES,",
  "PPI ASIA LINKS CORP",
  "PRECISTO INDUSTRIAL TRADING",
  "PROFESSIONAL GEAR, INC.",
  "QUICSAFE GENERAL MERCHANDISE",
  "R.B. CASTILLO ENTERPRISES",
  "RAPIDSAFE PHILIPPINES INC.",
  "RCORDS INDUSTRIAL SUPPLIES AND",
  "RECON TRADING",
  "REIDAR ENTERPRISES",
  "REIDAR ENTERPRISES CO.",
  "ROBART CONSTRUCTION SUPPLIES",
  "ROCKWELL ENTERPRISE INC",
  "ROMAN ESSENCE INTERNATIONAL",
  "ROMPRO INDUSTRIAL SUPPLY",
  "ROYAL HYGIENE AND SAFETY",
  "SAFETY4LESS INDUSTRIAL CORP.",
  "SAFETYKO INDUSTRIAL SUPPLIES",
  "SAFETYPRO INCORPORATED",
  "SAFEVIEW ENTERPRISES",
  "SEE MORE ENTERPRISE CO",
  "SGA TRADING",
  "SHOPBCD TRADING",
  "SMV ENTERPRISES",
  "ST. CLAIRE GARMENTS AND",
  "SUNCARE TRADING",
  "SUNTREK ENTERPRISES",
  "TAKEZO INDUSTRIAL SUPPLY",
  "TARGET SAFETY PERSONAL",
  "TOP LIFEGEAR MARKETING",
  "TRACMAC MARKETING",
  "TRI MAGNUM INC",
  "TRIBOHSE INDUSTRIAL TRADING",
  "TRI-JAGUAR SAFETY &",
  "TRUEWORKS HARDWARE CORPORATION",
  "UPRIGHT INDUSTRIAL CHEMICALS",
  "UPSAFE INDUSTRIAL COMPANY INC",
  "U-SAFE SAFETY SPECIALIST CORP.",
  "UYMATIAO TRADING CORPORATION",
  "VERDE MART",
  "VERIDIAN ENTERPRISES",
  "WASHINGTON ENTERPRISES INC.",
  "WELD POWERTOOLS INDUSTRIAL",
  "WORLD SAFETY SUPPLY CENTER INC",
  "ZENITH TECHNOLOGY INC.",
  "ZENTECH TRADING",
  "ZERO HAZARD TRADING"
];

const uniqueBusinessNames = [...new Map(businessNames.map(name => [name, name])).values()];

const OrderManagement = () => {
  const [orderData, setOrderData] = useState({
    deliver_to: '',
    additional_instructions: '',
    delivery_date: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setMessage('Please select a file to upload');
      return;
    }
    
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('products_file', selectedFile);
    formData.append('deliver_to', orderData.deliver_to);
    formData.append('additional_instructions', orderData.additional_instructions);
    formData.append('delivery_date', orderData.delivery_date);

    try {
      const response = await axios.post('https://deltaplus-delivery-schedule-backend.onrender.com/api/orders/create-with-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(`Order #${response.data.orderId} created successfully!`);
      setOrderData({
        deliver_to: '',
        additional_instructions: '',
        delivery_date: ''
      });
      setSelectedFile(null);
      document.getElementById('products_file').value = '';
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to send order.');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="order-management-container">
      <div className="order-management-card">
        <div className="order-management-header">
          <h2>Create New Order</h2>
          <p>Fill in the details below to create a delivery order</p>
        </div>
        
        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-group">
            <label className="form-label">
              <svg className="form-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 3l-7 7 4 4 7-7z" />
                <path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
              </svg>
              Products File
            </label>
            <div className="file-upload-area">
              <input type="file" id="products_file" onChange={handleFileChange} required
                accept=".txt,.csv,.xlsx,.xls,.pdf,.doc,.docx" className="file-input" />
              <label htmlFor="products_file" className="file-label">
                <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 4v12m-4-4l4 4 4-4" />
                  <path d="M4 16v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
                </svg>
                {selectedFile ? selectedFile.name : 'Choose File'}
              </label>
              <p className="file-hint">Accepted: TXT, CSV, Excel, PDF, Word (Max 10MB)</p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <svg className="form-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Delivery Date
            </label>
            <input 
              type="date" 
              name="delivery_date" 
              value={orderData.delivery_date}
              onChange={handleChange} 
              required 
              min={today} 
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <svg className="form-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h4l2 3 4-6 2 3h4" />
                <path d="M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
              </svg>
              Deliver To
            </label>
            <select 
              name="deliver_to" 
              value={orderData.deliver_to} 
              onChange={handleChange} 
              required 
              className="form-select"
            >
              <option value="">Select a business</option>
              {uniqueBusinessNames.map((business, index) => (
                <option key={index} value={business}>{business}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <svg className="form-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
              Additional Instructions
            </label>
            <textarea 
              name="additional_instructions" 
              value={orderData.additional_instructions}
              onChange={handleChange} 
              rows="4" 
              placeholder="Any special instructions for delivery..."
              className="form-textarea"
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? (
              <>
                <svg className="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Sending Order...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
                Send Order
              </>
            )}
          </button>
        </form>
        
        {message && (
          <div className={`message ${message.includes('successfully') ? 'message-success' : 'message-error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;