import React, { useState } from "react";
import SearchNavbar from "./searchNavbar";
import { Box, Typography } from "@mui/material";
import SliderPage from "./Slider"; // Import Slider Component
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate=useNavigate();

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  };

  return (
    <>
      <SearchNavbar
        isSignedIn={true}
        handleMenuOpen={handleMenuOpen}
        menuAnchor={menuAnchor}
        handleMenuClose={handleMenuClose}
        handleLogout={handleLogout}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      
    </>
  );
};

export default Homepage;
