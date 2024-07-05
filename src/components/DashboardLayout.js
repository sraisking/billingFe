import {
  Box,
  Button,
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
  const mainContentWidth = {
    xs: open ? "calc(100% - 150px)" : "calc(100% - 70px)", // Adjusted width when drawer is open on small screens
    sm: open ? "calc(100% - 300px)" : "calc(100% - 70px)",
  };

  const mainContentMarginLeft = isSmallScreen && open ? "150px" : "0"; // Margin-left adjustment for small screens when drawer is open

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
                    <PetList
                      pets={pets}
                      isSmallScreen={isSmallScreen}
                      refreshPets={refreshPets}
                    />
                  }
                />
                <Route path="pet/add" element={<AddPet />} />
                <Route path="pet/:id" element={<ViewOrEditPet />} />
              </Routes>
            </Stack>
          </Box>
        </Container>
      )}
    </Container>
  );
};
