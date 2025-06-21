import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  Typography,
  useMediaQuery,
  Grid,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { CustomDrawer } from "./CustomDrawer";
import { useDispatch, useSelector } from "react-redux";
import { fetchPets } from "../redux/petsSlice";
import { useTheme } from "@emotion/react";
import { Route, Routes } from "react-router-dom";
import { PetList } from "./PetList";
import { ViewOrEditPet } from "./ViewOrEditPet";
import { AddPet } from "./AddPet";
import { PetStatsChart } from "./PetStatsChart";
import { Expenses } from "./Expenses";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import { BottomNav } from "./BottomNav";

export const DashboardLayout = ({
  open,
  handleDrawerOpen,
  handleDrawerClose,
}) => {
  const dispatch = useDispatch();
  const { pets, loading, error } = useSelector((state) => state.pets);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchPets());
  }, [dispatch]);

  const refreshPets = () => dispatch(fetchPets());

  const filteredPets = pets.filter((pet) => {
    if (filter === "paid") return pet.paid;
    if (filter === "partially") return !pet.paid && pet.partiallyPaid?.isPartiallyPaid;
    if (filter === "unpaid") return !pet.paid && !pet.partiallyPaid?.isPartiallyPaid;
    return true;
  });

  const paidPets = pets.filter((pet) => pet.paid);
  const partiallyPaidPets = pets.filter(
    (pet) => !pet.paid && pet.partiallyPaid?.isPartiallyPaid
  );
  const unpaidPets = pets.filter(
    (pet) => !pet.paid && !pet.partiallyPaid?.isPartiallyPaid
  );

  const totalAmountCollected = pets.reduce((sum, pet) => {
    if (pet.paid) return sum + (pet.totalExpense || 0);
    if (pet.partiallyPaid?.isPartiallyPaid) return sum + (pet.partiallyPaid.amount || 0);
    return sum;
  }, 0);

  const totalPendingAmount = pets.reduce((sum, pet) => {
    if (pet.paid) return sum;
    const expense = pet.totalExpense || 0;
    const paidAmount = pet.partiallyPaid?.amount || 0;
    return sum + (expense - paidAmount);
  }, 0);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundImage:
          "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(204,233,148,1) 100%)",
      }}
    >
      {/* Small screen menu toggle */}
      {isSmallScreen && (
        <IconButton
          onClick={handleDrawerOpen}
          sx={{ position: "fixed", top: 16, left: 16, zIndex: 1300 }}
          color="primary"
        >
          <MenuIcon />
        </IconButton>
      )}


      {!isSmallScreen && (
        <CustomDrawer open={open} handleDrawerClose={handleDrawerClose} />
      )}
      {isSmallScreen && (
        <BottomNav />
      )}


      {/* Main Content */}
      <Box
        sx={{
          marginLeft: !isSmallScreen ? (open ? "200px" : "70px") : 0,
          padding: theme.spacing(2),
          width: !isSmallScreen ? `calc(100% - ${open ? 200 : 70}px)` : "100%",
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        ) : (
          <>
            <Stack direction={"column"} alignItems={"center"}>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={refreshPets}
                sx={{ marginBottom: 2, width: "100px" }}
              >
                Refresh
              </Button>
              <Routes>
                <Route
                  index
                  element={
                    <>
                      {/* Dashboard cards */}
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                        flexWrap="wrap"
                        useFlexGap
                        mb={2}
                      >
                        {[
                          { title: "Total Pets", count: pets.length, bg: "#d0f0c0" },
                          { title: "Fully Paid", count: paidPets.length, bg: "#c8e6c9" },
                          { title: "Partially Paid", count: partiallyPaidPets.length, bg: "#fff9c4" },
                          { title: "Unpaid", count: unpaidPets.length, bg: "#ffcdd2" },
                          { title: "Amount Collected", count: `₹${totalAmountCollected}`, bg: "#bbdefb" },
                          { title: "Pending Amount", count: `₹${totalPendingAmount}`, bg: "#f8bbd0" },
                        ].map(({ title, count, bg }) => (
                          <Card key={title} sx={{ minWidth: 150, maxWidth: 200, backgroundColor: bg, flex: "1 1 150px" }}>
                            <CardContent>
                              <Typography variant="h6">{title}</Typography>
                              <Typography>{count}</Typography>
                            </CardContent>
                          </Card>
                        ))}
                      </Stack>

                      <PetStatsChart
                        data={{
                          paid: paidPets.length,
                          partiallyPaid: partiallyPaidPets.length,
                          unpaid: unpaidPets.length,
                        }}
                      />

                      {/* Filter buttons */}
                      <Stack
                        direction={isSmallScreen ? "column" : "row"}
                        spacing={2}
                        mb={2}
                        justifyContent="center"
                      >
                        {["all", "paid", "partially", "unpaid"].map((key) => (
                          <Button
                            key={key}
                            variant={filter === key ? "contained" : "outlined"}
                            color={
                              key === "paid"
                                ? "success"
                                : key === "partially"
                                  ? "warning"
                                  : key === "unpaid"
                                    ? "error"
                                    : "primary"
                            }
                            onClick={() => setFilter(key)}
                          >
                            {key === "all"
                              ? "All"
                              : key.charAt(0).toUpperCase() + key.slice(1) + " Paid"}
                          </Button>
                        ))}
                      </Stack>

                      <PetList
                        pets={filteredPets}
                        isSmallScreen={isSmallScreen}
                        refreshPets={refreshPets}
                      />
                    </>
                  }
                />
                <Route path="pet/add" element={<AddPet />} />
                <Route path="pet/:id" element={<ViewOrEditPet />} />
                <Route path="pet/expenses" element={<Expenses />} />
              </Routes>
            </Stack>
          </>
        )}
      </Box>
    </Box>
  );
};
