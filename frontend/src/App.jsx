import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import BookList from './components/BookList';
import PrivateRoute from './components/PrivateRoute';
import RegisterPage from './components/RegisterPage';
import AddBook from './components/AddBook';
import EditBook from './components/EditBook';
import Navbar from './components/Navbar';
import BookDetails from './components/BookDetails';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Redirect logic
const RedirectRoute = () => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/books" replace /> : <Navigate to="/login" replace />;
};

const PublicOnlyRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/books" replace /> : children;
};

// 🧠 Layout wrapper that adds Navbar conditionally
const Layout = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const hideNavbarRoutes = ['/login', '/register'];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<RedirectRoute />} />
            <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
            <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
            <Route path="/books" element={<PrivateRoute><BookList /></PrivateRoute>} />
            {/* <Route path="/add" element={<PrivateRoute><AddBook /></PrivateRoute>} />
            <Route path="/edit/:id" element={<PrivateRoute><EditBook /></PrivateRoute>} /> */}
            <Route path="/books/:id" element={<PrivateRoute><BookDetails /></PrivateRoute>} />
          </Routes>
        </Layout>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
