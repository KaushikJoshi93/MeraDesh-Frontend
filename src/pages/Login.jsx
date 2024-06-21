import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MiuiLink from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from '../components/Navbar';
import { useQuery } from 'react-query';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { useDispatch } from 'react-redux'
import { login } from '../redux/userSlice';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <MiuiLink color="inherit" href="https://mui.com/">
                meradesh
            </MiuiLink>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export default function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const dispatch = useDispatch();

    const loginUser = async () => {
        try {
            let res = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/auth/signin", { email, password });
            return res.data;
        } catch (err) {
            toast.error("Wrong!! Username and password", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            setEmail("");
            setPassword("");
            return {};
        }
    }

    const { data: user, isError, isLoading, refetch, isFetched, isFetching } = useQuery('user', loginUser, {
        refetchOnWindowFocus: false,
        enabled: false
    });

    if (isFetched && !isError) {
        dispatch(login(user));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (!data.get("email") || !data.get("password")) {
            toast.warn("Please fill the missing values!!", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
        email && password && refetch();
    };


    return (
        <Box>
            <ToastContainer />
            <Navbar />
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 12,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
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
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {isFetching ? <CircularProgress sx={{ color: 'white' }} /> : "Sign In"}
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <MiuiLink href="#" variant="body2">
                                        Forgot password?
                                    </MiuiLink>
                                </Grid>
                                <Grid item>
                                    <MiuiLink href="#" variant="body2">
                                        <Link to={"/signup"}>
                                            {"Don't have an account? Sign Up"}
                                        </Link>
                                    </MiuiLink>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Copyright sx={{ mt: 8, mb: 4 }} />
                </Container>
            </ThemeProvider>
        </Box>
    );
}