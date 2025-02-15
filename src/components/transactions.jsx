import React, { useState, useEffect } from 'react';
import {
  Button,
  ButtonGroup,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import TopNavbar from './topNavbar';
import axios from 'axios'; // Ensure axios is imported
import { useNavigate } from 'react-router-dom';

const TransactionPage = () => {
  const [role, setRole] = useState('buyer');
  const [status, setStatus] = useState('pending');
  const [cardData, setCardData] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const navigate=useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const URL = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_GET_TRANSACTION_BASED_ON_PRODUCT_STATUS}${status}`;
        const token = localStorage.getItem("token");
  
        const response = await axios.get(URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        console.log(
          "Response while fetching transaction data based on product status",
          response?.data
        );
  
        const transactions = response?.data?.data[0];
        
        console.log("transactions based on product status",transactions)
        if(!transactions){
          setError("No data found")
          return
        }

        //fetch current user
        const url = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_GET_CURRENT_USER}`;
      
        
        const currUser = await axios.get(
          url,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("GET current user:", currUser?.data);
        if (currUser){
            if (role === "buyer") {
              await fetchBuyerData(transactions, token,currUser?.data?.data?._id);
            } else if (role === "seller") {
              await fetchSellerData(transactions, token,currUser?.data?.data?._id);
            }
          }
      } catch (err) {
        console.error("Error fetching initial transaction data:", err);
        setError("No data available");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchInitialData();
  }, [role, status]); // Refetch data when role or status changes


  const fetchBuyerData = async (transaction, token,currUserId) => {
    try {
      const URL = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_GET_BUYER_DATA}`;
      const response = await axios.post(
        URL,
        {
            userId: currUserId,
            productId: transaction.product._id,
            status,
          
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Buyer-specific data fetched:", response?.data);
      setCardData(response.data.data); // Set product data for buyers
    } catch (err) {
      console.error("Error fetching buyer data:", err);
      setError("No data Available!");
    }
  };
  
  const fetchSellerData = async (transaction, token,currUserId) => {
    try {



      const URL = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_GET_SELLER_DATA}`;
  
      const response = await axios.post(
        URL,
        {
          
            ownerId: currUserId,
            productId: transaction.product._id,
            status,
          
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Seller-specific data fetched:", response.data);
      setCardData(response.data.data); // Set product data for sellers
    } catch (err) {
      console.error("Error fetching seller data:", err);
      setError("No data available!");
    }
  };


  // Handle role button click
  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  // Handle status dropdown change
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  
  const handleAccept=async(id)=>{
    if(!id){
      console.log("No product id found to update status!")
      return
    }
    
    try {
      const URL = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_UPDATE_PRODUCT_BY_ID}${id}`;

      const token = localStorage.getItem('token');
      const resp = await axios.patch(URL, 
        {
            status:'accepted'
        },
        {
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      console.log("response while updating status to accepted",resp)
      setStatus('accepted')

      
    } catch (err) {

      console.log('Failed to update product status. Please try again.',err); // Set error message
    } 


  }
  const handleReject=async(id)=>{
    try {
      const URL = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_UPDATE_PRODUCT_BY_ID}${id}`;
      const token = localStorage.getItem('token');
      const response = await axios.patch(URL, 
        {
            status:'deny'
        },
        {
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      console.log("response while updating status to deny",response)
      setStatus('deny')

      
      
    } catch (err) {

      console.log('Failed to update product status. Please try again.',err); // Set error message
    } 
  }

  return (
    <>
      <TopNavbar/>
      <Box sx={{ height: "40px" }} />
      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '98vh',
          width: '100%',
          overflow: 'hidden',

        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '90%',
            padding: 2,
            border: '1px solid #ddd',
            backgroundColor: '#e6f7f5',
            borderRadius: '8px',
          }}
        >
          <Typography variant="h3" align="center" gutterBottom>
            Transactions
          </Typography>

          {/* Role and Status Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <ButtonGroup variant="contained" color="primary">
              <Button
                onClick={() => handleRoleChange('buyer')}
                color={role === 'buyer' ? 'success' : 'primary'}
              >
                Buyer
              </Button>
              <Button
                onClick={() => handleRoleChange('seller')}
                color={role === 'seller' ? 'success' : 'primary'}
              >
                Seller
              </Button>
            </ButtonGroup>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={status}
                label="Status"
                onChange={handleStatusChange}
              >
                <MenuItem value='none' onClick={()=>setCardData([])}>None</MenuItem>
                <MenuItem value="success" onClick={()=>setStatus('completed')}>Success</MenuItem>
                <MenuItem value="pending" onClick={()=>setStatus('pending')}>Pending</MenuItem>
          
                <MenuItem value="accepted" onClick={()=>setStatus('accepted')}>Accepted</MenuItem>
                <MenuItem value="failed" onClick={()=>setStatus('failed')}>Failed</MenuItem>
                <MenuItem value="deny" onClick={()=>setStatus('deny')}>Deny</MenuItem>

              </Select>
            </FormControl>
          </Box>

          {/* Loading Indicator */}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Error Alert */}
          {error && (
            <Box sx={{ marginTop: 4 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}

          {/* Cards Section */}
          {!isLoading && !error && (
            <Grid container spacing={3}>
              {Array.isArray(cardData) ? (cardData.map((card) => (
                card?.product?
                (<Grid item xs={12} sm={6} md={2} key={card._id}>
                  <Card
                    sx={{
                      position: 'relative',
                      '&:hover .card-overlay': {
                        opacity: 1,
                      },
                    }}
                    onMouseEnter={() => setHoveredCard(card.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={card?.product?.image}
                      alt={card?.product?.name || "N?A"}
                    />
                    <CardContent>
                      <Typography variant="h6">{card?.product?.name || "No product"}</Typography>
                      <Typography color="textSecondary">{`Quality: ${card?.product?.quality}` || "No quality"}</Typography>
                      <Typography color="textSecondary">{`Price: $${card?.product?.min_price || 0}) - $${card?.product?.max_price || 0}`}</Typography>
                    </CardContent>
                    <Box
                      className="card-overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="h6">Owner: {card.product?.owner_details?.name || "unknown"}</Typography>
                      {/* <Typography variant="body2">State: {card.product.owner_details.state}</Typography>
                      <Typography variant="body2">Mandal: {card.product.owner_details.mandal}</Typography>
                      <Typography variant="body2">Village: {card.product.owner_details.village}</Typography> */}

                      <CardActions>
                        {status === 'pending' ? (
                          role === 'seller' ? (
                            <>
                              <Button
                                variant="contained"
                                onClick={() => handleAccept(card?.product?._id || null)}
                                color="success"
                                sx={{ marginRight: 1 }}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="contained"
                                onClick={() => handleReject(card?.product?._id || null)}
                                color="error"
                              >
                                Reject
                              </Button>
                            </>
                          ) : (
                            <Typography>Waiting for seller to accept your request!</Typography>
                          )
                        ) : status === 'deny' ? (
                          role === 'seller' ? (
                            <Typography>You denied buyer request</Typography>
                          ) : (
                            <Typography>Seller denied your request!</Typography>
                          )
                        ) : status==='failed'? (
                          role === 'seller' ? (
                            <Typography>Buyer don't want this now!</Typography>
                          ) : (
                            <Typography>You cancelled your request before payment!</Typography>
                          )
                        ) :status === 'accepted' ? (
                          role === 'buyer' ? (
                            <Button
                              variant="contained"
                              onClick={() => {
                                navigate(`/transaction/${card?._id}/tc`, {
                                  state: {
                                    transaction: card,
                                  },
                                });
                              }}
                              color="primary"
                              sx={{ marginRight: 1 }}
                            >
                              View
                            </Button>
                          ) : role === 'seller' ? (
                            <Button
                              variant="contained"
                              onClick={async () => {
                                try {
                                  const URL = `${import.meta.env.VITE_NODEJS_BACKEND_ROOT}${import.meta.env.VITE_GET_TRANSACTION_DATA_BY_PRODUCT_DETAILS}`;
                                  const token = localStorage.getItem('token');
                                  const response = await axios.post(
                                    URL,
                                    {
                                      productId: card.product._id,
                                      createdOn: card.product.createdOn,
                                    },
                                    {
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                        'Content-Type': 'application/json',
                                      },
                                    }
                                  );
                                  if (response?.data) {
                                    navigate('/seller/accepted', {
                                      state: response?.data?.data,
                                    });
                                  }
                                } catch (err) {
                                  console.log('Failed to fetch transaction details. Please try again.', err);
                                }
                              }}
                              color="primary"
                              sx={{ marginRight: 1 }}
                            >
                              View
                            </Button>
                          ) : null
                        ) : null}
                      </CardActions>




                      

                    </Box>
                  </Card>
                </Grid>):setError('No data available')
              ))): setError('No data available')}
            </Grid>
          )}
        </Box>
      </Box>
    </>
  );
};

export default TransactionPage;
