import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect } from "react";
import { CustomDrawer } from "./CustomDrawer";
import { useDispatch, useSelector } from "react-redux";
import { fetchPets } from "../redux/petsSlice";
import PetCard from "./PetCard";
import { useTheme } from "@emotion/react";
import { Outlet, Route, Routes } from "react-router-dom";
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
  return (
    <Container
      maxWidth="lg"
      sx={{
        backgroundImage:
          "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(204,233,148,1) 100%)",
        minHeight: "100vh",
        minWidth: "100vw",
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
          <Routes>
            <Route
              index
              element={<PetList pets={pets} isSmallScreen={isSmallScreen} refreshPets={refreshPets}/>}
            />
            <Route path="pet/add" element={<AddPet />} />
            <Route path="pet/:id" element={<ViewOrEditPet />} />
          </Routes>
        </Container>
      )}
    </Container>
  );
};
