import React, { useEffect } from "react";
// import "./App.css";
import {
  Container,
  CssBaseline,
  IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  styled,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";

import { PetsOutlined } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { DashboardLayout } from "./components/DashboardLayout";
import { Login } from "./components/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./redux/store";
import { loginSuccess, logout } from "./redux/authSlice";
import { ViewOrEditPet } from "./components/ViewOrEditPet";
import { CustomDrawer } from "./components/CustomDrawer";
import { Signup } from "./components/Signup";
function App() {
  const theme = createTheme({
    palette: {
      background: {
        default:
          "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(204,233,148,1) 100%)",
      },
      primary: {
        main: "#F5ED31",
      },
      secondary: {
        main: "#FF934F",
      },
    },
    typography: {
      allVariants: {
        color: "#0D0C0B",
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
      width: "calc(100% - 300px)",
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
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
    dispatch(logout()); // Dispatch logout action
    navigate("/login"); // Redirect to login screen
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <div className="App"> */}
      <Container
        maxWidth="lg"
        sx={{
          paddingTop: "64px", // Adjusted top padding to accommodate AppBar
          backgroundImage:
            "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(204,233,148,1) 100%)",
          minHeight: "100vh",
          minWidth: "100vw",
          position: "relative", // Ensure proper positioning for the AppBar
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
                  marginRight: 5,
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap component="div">
              YCF Billing Portal
            </Typography>
            <FavoriteIcon />
            <PetsOutlined />
            <FavoriteIcon />
            {isAuthenticated && ( // Render logout button if authenticated
              <IconButton
                color="inherit"
                aria-label="logout"
                onClick={handleLogout}
                sx={{ marginLeft: "auto" }}
              >
                Logout
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
        <CustomDrawer open={open} handleDrawerClose={handleDrawerClose} />
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="dashboard/*"
              element={
                <DashboardLayout
                  open={open}
                  handleDrawerOpen={handleDrawerOpen}
                  handleDrawerClose={handleDrawerClose}
                />
              }
            />
          </Route>
          {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

export default App;
