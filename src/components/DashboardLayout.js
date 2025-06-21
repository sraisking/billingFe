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
} from "@mui/material";
import React, { useEffect } from "react";
import { CustomDrawer } from "./CustomDrawer";
import { useDispatch, useSelector } from "react-redux";
import { fetchPets } from "../redux/petsSlice";
import { useTheme } from "@emotion/react";
import { Route, Routes } from "react-router-dom";
import { PetList } from "./PetList";
import { ViewOrEditPet } from "./ViewOrEditPet";
import { AddPet } from "./AddPet";
import { PetStatsChart } from "./PetStatsChart";
import {Expenses} from "./Expenses";

export const DashboardLayout = ({
  open,
  handleDrawerOpen,
  handleDrawerClose,
}) => {
  const dispatch = useDispatch();
  const { pets, loading, error } = useSelector((state) => state.pets);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    dispatch(fetchPets());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  console.log({ loading, error });
  const refreshPets = () => {
    dispatch(fetchPets());
  };
  const [filter, setFilter] = React.useState("all");

  const filteredPets = pets.filter((pet) => {
    if (filter === "paid") return pet.paid;
    if (filter === "partially")
      return !pet.paid && pet.partiallyPaid?.isPartiallyPaid;
    if (filter === "unpaid")
      return !pet.paid && !pet.partiallyPaid?.isPartiallyPaid;
    return true;
  });
  const mainContentWidth = {
    xs: open ? "calc(100% - 150px)" : "calc(100% - 70px)", // Adjusted width when drawer is open on small screens
    sm: open ? "calc(100% - 300px)" : "calc(100% - 70px)",
  };

  const mainContentMarginLeft = isSmallScreen && open ? "150px" : "0"; // Margin-left adjustment for small screens when drawer is open

  const paidPets = pets.filter((pet) => pet.paid);
  const partiallyPaidPets = pets.filter(
    (pet) => !pet.paid && pet.partiallyPaid?.isPartiallyPaid
  );
  const unpaidPets = pets.filter(
    (pet) => !pet.paid && !pet.partiallyPaid?.isPartiallyPaid
  );

  const totalAmountCollected = pets.reduce((sum, pet) => {
    if (pet.paid) {
      return sum + (pet.totalExpense || 0);
    } else if (pet.partiallyPaid?.isPartiallyPaid) {
      return sum + (pet.partiallyPaid.amount || 0);
    }
    return sum;
  }, 0);

  const totalPendingAmount = pets.reduce((sum, pet) => {
    if (pet.paid) return sum;
    const expense = pet.totalExpense || 0;
    const paidAmount = pet.partiallyPaid?.amount || 0;
    return sum + (expense - paidAmount);
  }, 0);
  return (
    <Container
      maxWidth="lg"
      sx={{
        backgroundImage:
          "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(204,233,148,1) 100%)",
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: theme.spacing(2),
      }}
    >
      <CustomDrawer open={open} handleDrawerClose={handleDrawerClose} />
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : (
        <Container>
          <Box
            width={mainContentWidth}
            sx={{
              marginTop: theme.spacing(2),
              marginLeft: mainContentMarginLeft,
              transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }}
          >
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
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                        mb={2}
                      >
                        <Card sx={{ minWidth: 150, bgcolor: "#d0f0c0" }}>
                          <CardContent>
                            <Typography variant="h6">Total Pets</Typography>
                            <Typography>{pets.length}</Typography>
                          </CardContent>
                        </Card>
                        <Card sx={{ minWidth: 150, bgcolor: "#c8e6c9" }}>
                          <CardContent>
                            <Typography variant="h6">Fully Paid</Typography>
                            <Typography>{paidPets.length}</Typography>
                          </CardContent>
                        </Card>
                        <Card sx={{ minWidth: 150, bgcolor: "#fff9c4" }}>
                          <CardContent>
                            <Typography variant="h6">Partially Paid</Typography>
                            <Typography>{partiallyPaidPets.length}</Typography>
                          </CardContent>
                        </Card>
                        <Card sx={{ minWidth: 150, bgcolor: "#ffcdd2" }}>
                          <CardContent>
                            <Typography variant="h6">Unpaid</Typography>
                            <Typography>{unpaidPets.length}</Typography>
                          </CardContent>
                        </Card>
                        <Card sx={{ minWidth: 150, bgcolor: "#bbdefb" }}>
                          <CardContent>
                            <Typography variant="h6">
                              Amount Collected
                            </Typography>
                            <Typography>₹{totalAmountCollected}</Typography>
                          </CardContent>
                        </Card>
                        <Card sx={{ minWidth: 150, bgcolor: "#f8bbd0" }}>
                          <CardContent>
                            <Typography variant="h6">Pending Amount</Typography>
                            <Typography>₹{totalPendingAmount}</Typography>
                          </CardContent>
                        </Card>
                      </Stack>
                      <PetStatsChart
                        data={{
                          paid: paidPets.length,
                          partiallyPaid: partiallyPaidPets.length,
                          unpaid: unpaidPets.length,
                        }}
                      />
                      <Stack
                        direction="row"
                        spacing={2}
                        mb={2}
                        justifyContent="center"
                      >
                        <Button
                          variant={filter === "all" ? "contained" : "outlined"}
                          onClick={() => setFilter("all")}
                        >
                          All
                        </Button>
                        <Button
                          variant={filter === "paid" ? "contained" : "outlined"}
                          color="success"
                          onClick={() => setFilter("paid")}
                        >
                          Paid
                        </Button>
                        <Button
                          variant={
                            filter === "partially" ? "contained" : "outlined"
                          }
                          color="warning"
                          onClick={() => setFilter("partially")}
                        >
                          Partially Paid
                        </Button>
                        <Button
                          variant={
                            filter === "unpaid" ? "contained" : "outlined"
                          }
                          color="error"
                          onClick={() => setFilter("unpaid")}
                        >
                          Unpaid
                        </Button>
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
          </Box>
        </Container>
      )}
    </Container>
  );
};
