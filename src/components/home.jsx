import React, { useState } from "react";
import SearchNavbar from "./searchNavbar";
import ProductNavbar from "./productNavbar";
import { Box, Typography } from "@mui/material";
import SliderPage from "./Slider"; // Import Slider Component
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const productCategories = ["ALL", "Groundnut", "Paddy", "Tomatoes", "Chillies"];
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
        handleSignInSignOut={handleLogout}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      {/* <ProductNavbar productCategories={productCategories} /> */}

      
    </>
  );
};

export default Homepage;
