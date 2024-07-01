import React, { useEffect } from "react";
import {
  Container,
  CssBaseline,
  IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  styled,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { PetsOutlined, Favorite as FavoriteIcon } from "@mui/icons-material";
import { DashboardLayout } from "./components/DashboardLayout";
import { Login } from "./components/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess, logout } from "./redux/authSlice";
import { Signup } from "./components/Signup";
import LogoutIcon from "@mui/icons-material/Logout";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#673AB7", // Deep Purple
      },
      secondary: {
        main: "#FF5722", // Deep Orange
      },
      background: {
        default: "#F3E5F5", // Light Purple
      },
    },
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
      h6: {
        fontWeight: 600,
      },
    },
  });

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: "300px",
      width: "calc(100% - 200px)",
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
    [theme.breakpoints.down("md")]: {
      ...(open && {
        marginLeft: "200px",
        width: "calc(100% - 200px)",
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }),
    },
    [theme.breakpoints.down("sm")]: {
      ...(open && {
        marginLeft: "100px",
        width: "calc(100% - 200px)",
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }),
    },
  }));

  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
    localStorage.setItem("drawerOpen", "true");
  };
  const handleDrawerClose = () => {
    setOpen(false);
    localStorage.setItem("drawerOpen", "false");
  };

  const history = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(loginSuccess(token));
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  console.log(isSmallScreen);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth="lg"
        sx={{
          paddingTop: "64px",
          backgroundImage:
            "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(204,233,148,1) 100%)",
          minHeight: "100vh",
          minWidth: "100vw",
          position: "relative",
        }}
      >
        <AppBar position="fixed" open={open}>
          <Toolbar>
            {history.pathname === "/dashboard" && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 2,
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant={isSmallScreen ? "subtitle1" : "h5"}
              noWrap
              component="div"
            >
              {open ? "YCF" : "YCF Billing Portal"}
            </Typography>
            <IconButton color="inherit" aria-label="favorites" sx={{ ml: 2 }}>
              <FavoriteIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="pets" sx={{ ml: 2 }}>
              <PetsOutlined />
            </IconButton>
            {isAuthenticated && (
              <IconButton
                color="inherit"
                aria-label="logout"
                onClick={handleLogout}
                sx={{ marginLeft: "auto" }}
              >
                Logout
               
              </IconButton>
            )}
            {isAuthenticated && isSmallScreen && (
              <IconButton
                color="inherit"
                aria-label="logout"
                onClick={handleLogout}
                sx={{ marginLeft: "auto" }}
              >
                <LogoutIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard/*"
              element={
                <DashboardLayout
                  open={open}
                  handleDrawerOpen={handleDrawerOpen}
                  handleDrawerClose={handleDrawerClose}
                />
              }
            />
          </Route>
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

export default App;
