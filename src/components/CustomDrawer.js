import {
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  useTheme,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddTaskIcon from "@mui/icons-material/AddTask";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import { useLocation, useNavigate } from "react-router-dom";

const navigationMapper = {
  Dashboard: <DashboardIcon />,
  "Add Pets": <AddTaskIcon />,
  Settings: <SettingsIcon />,
};

export const CustomDrawer = ({ handleDrawerClose, open }) => {
  const theme = useTheme();
  const location = useLocation();
  console.log(location);

  const navigate = useNavigate();

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    width: "300px", // Default width for larger screens
    [theme.breakpoints.down("sm")]: {
      width: "200px", // Adjusted width for smaller screens
    },
    "& .MuiPaper-root": {
      backgroundColor: "transparent",
    },
    "& .MuiDrawer-paper": {
      backgroundColor: "transparent",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      overflowX: "hidden",
      ...(open && {
        width: "200px", // Expanded width when drawer is open
      }),
      ...(!open && {
        width: "70px", // Collapsed width when drawer is closed
      }),
    },
  }));

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  }));

  const handleClick = (text) => () => {
    console.log(text);
    if (text === "Add Pets") navigate("pet/add");
    if (text === "Dashboard") navigate("/dashboard");
    handleDrawerClose()
  };

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {["Dashboard", "Add Pets", "Settings"].map((text, index) => (
          <ListItem key={text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
              onClick={handleClick(text)}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {navigationMapper[text]}
              </ListItemIcon>
              <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};