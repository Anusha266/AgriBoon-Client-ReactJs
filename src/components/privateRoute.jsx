import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initially null (loading state)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const url = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_GET_CURRENT_USER}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });

        if (response.status === 200) {
          setIsAuthenticated(true); // User is authenticated
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false); // If error occurs, assume not authenticated
        console.error("Failed to fetch current user:", err);
      }
    };

    fetchCurrentUser();
  }, [token]); // Runs only when token changes

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show a loading state while checking authentication
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
