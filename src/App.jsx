import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/signup';
import Login from './components/login';
import Home from './components/home';
import Transactions from './components/transactions';
import UploadProduct from './components/product_upload';
import ProductDetail from './components/ProductDetail';
import TermsAndConditions from './components/TermsAndConditions';
import NegotiationPage from './components/Negotiation';
import OTPPage from './components/OTPPage';
import SellerAcceptedPage from './components/sellerAccepted';
import PaymentPage from './components/payment';
import PaymentSuccess from './components/payment_success';
import Cart from './components/cart';
import PrivateRoute from './components/privateRoute'
import ProfileSetup from './components/profile';
import ProfileDisplay from './components/profileDisplay';
import { GlobalStateProvider } from './components/GlobalState';

function App() {
  return (
    <Router>
      <GlobalStateProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Private Routes */}
        <Route
          path="/profile/create"
          element={
            <PrivateRoute>
              < ProfileSetup/>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              < ProfileDisplay/>
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <Transactions />
            </PrivateRoute>
          }
        />
        <Route
          path="/product/upload"
          element={
            <PrivateRoute>
              <UploadProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/product/get/:id"
          element={
            <PrivateRoute>
              <ProductDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/transaction/:transactionId/tc"
          element={
            <PrivateRoute>
              <TermsAndConditions />
            </PrivateRoute>
          }
        />
        <Route
          path="/negotiation/:transactionId"
          element={
            <PrivateRoute>
              <NegotiationPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/otp/:transactionId"
          element={
            <PrivateRoute>
              <OTPPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/seller/accepted"
          element={
            <PrivateRoute>
              <SellerAcceptedPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <PrivateRoute>
              <PaymentPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment-success"
          element={
            <PrivateRoute>
              <PaymentSuccess />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
      </Routes>
      </GlobalStateProvider>
    </Router>
  );
}

export default App;
