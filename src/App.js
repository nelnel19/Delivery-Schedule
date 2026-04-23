import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import OrderManagement from "./components/OrderManagement";
import Orders from "./components/Orders";
import Logistics from "./components/Logistics";
import Header from "./components/Header";

// Layout component for protected routes with header
const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="container">
        {children}
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/order" element={
          <Layout>
            <OrderManagement />
          </Layout>
        } />
        <Route path="/orders" element={
          <Layout>
            <Orders />
          </Layout>
        } />
        <Route path="/logistics" element={<Logistics />} />
      </Routes>
    </Router>
  );
}

export default App;