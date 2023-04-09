import * as React from 'react';
import { useContext, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Slider from "react-slick";
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { ReactComponent as Icon } from "../assets/Smarchitect.svg"
import {styled} from '@mui/material/';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LandingImage from './Blur2.avif'; 
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../context/AuthContext';
import {Login as LoginUser} from '../services/apiServices';
import SmarchitectIcon from "../assets/SmarchitectLogo.png";
import "./typography_animation.css"

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        Smarchitect
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}




const theme = createTheme({
    palette: {
        type: 'dark',
        primary: {
          main: '#3f51b5',
        },
        secondary: {
          main: '#f50057',
        },
        mode: 'dark'
    },
});
const Icons = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "20px",
}));

export default function SignInSide() {

  const auth = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    console.log({
      email,
      password,
    });

    LoginUser(email, password)
      .then((log) => {
        if (log.status === 201) {
          console.log(log.data)
          auth.setUser(log.data);
          auth.login();
        }
      })
      .catch((err) => {
        setErrorMessage("Invalid login credentials");
        console.log("Error: " + err);
      });
  };

  return (
    
      <Grid container component="main" sx={{ height: "100vh" , fontSize: "40px" }}>
        <CssBaseline />
        
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={2} >
          <Box
            sx={{
              my: 10,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
              <img src={SmarchitectIcon} alt="My SVG Image" style={{ width: "600px", height: "400px" }}  />

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                error={errorMessage === "" ? false: true}
                style={{ backgroundColor: 'white' }}
                sx={{
                  borderRadius: '10px'
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                helperText={errorMessage}
                error={errorMessage === "" ? false: true}
                sx={{
                  borderRadius: '20px'
                }}
              />
            <Button
  type="submit"
  fullWidth
  variant="contained"
  sx={{
    mt: 3,
    mb: 2,
      height: '60px',
    borderRadius: '50px',
    padding: '12px 24px',
    backgroundColor: "#F57663",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#FFA546",
              },
  }}
>
  Sign In
</Button>
<Typography variant="body2" sx={{marginTop: 2, pt: 1, mt: { md: -2 } }}>
  Don’t have an account? 
  <Link variant="subtitle2" sx={{pl:1}} component={RouterLink} to={'/register'}>
    Get started
  </Link>
</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{        
            backgroundImage: `url(${LandingImage})`,

            backgroundRepeat: "no-repeat",
            backgroundColor: "primary", //(t) =>
            //t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
  
        </Grid>
      </Grid>
  );
} 