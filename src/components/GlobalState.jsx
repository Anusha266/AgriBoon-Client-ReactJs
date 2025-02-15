import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// Create Context
export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <GlobalStateContext.Provider
      value={{
        handleMenuOpen,
        handleMenuClose,
        handleLogout,
        menuAnchor,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
