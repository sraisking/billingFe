import {
    BottomNavigation,
    BottomNavigationAction,
    Paper,
  } from "@mui/material";
  import DashboardIcon from "@mui/icons-material/Dashboard";
  import AddTaskIcon from "@mui/icons-material/AddTask";
  import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
  import { useNavigate, useLocation } from "react-router-dom";
  import { useEffect, useState } from "react";
  
  export const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [value, setValue] = useState("/dashboard");
  
    useEffect(() => {
      setValue(location.pathname);
    }, [location.pathname]);
  
    return (
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1300 }}
        elevation={3}
      >
        <BottomNavigation
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            navigate(newValue);
          }}
          showLabels
        >
          <BottomNavigationAction
            label="Dashboard"
            value="/dashboard"
            icon={<DashboardIcon />}
          />
          <BottomNavigationAction
            label="Add Pets"
            value="/dashboard/pet/add"
            icon={<AddTaskIcon />}
          />
          <BottomNavigationAction
            label="Expenses"
            value="/dashboard/pet/expenses"
            icon={<CurrencyRupeeIcon />}
          />
        </BottomNavigation>
      </Paper>
    );
  };
  