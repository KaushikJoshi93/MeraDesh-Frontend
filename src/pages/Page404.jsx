import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom'

export default function Page404() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid item xs={12} md={4} style={{ display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems: "center" }}>
            <Typography variant="h1" style={{ textAlign: "center" }}>
              404
            </Typography>
            <Typography variant="h6" style={{ textAlign: "center" }}>
              The page you’re looking for doesn’t exist.
            </Typography>
            <Button variant="contained" style={{ marginTop: "22px", width: "50%" }}><Link to={"/"} style={{ textDecoration: "none", color: "white" }}> Back Home </Link></Button>
          </Grid>
          <Grid item xs={2} md={6} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
            <img
              src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569__340.jpg"
              alt=""
              style={{ width: "100%", height: "100%" }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}