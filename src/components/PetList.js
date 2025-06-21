import { Box, Grid, Stack, Typography } from "@mui/material";
import PetCard from "./PetCard";
import { useNavigate } from "react-router-dom";

export const PetList = ({ pets, isSmallScreen, refreshPets }) => {
  const navigate = useNavigate();
  const handleViewClicked = (id) => {
    console.log(id);
    navigate(`pet/${id}`);
  };

  return (
    <>
      {pets.length === 0 ? (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1300, // Higher than drawer's z-index
            textAlign: "center",
            width: "100%",
          }}
        >
          <Typography variant="h5" color="text.secondary">
            No pets found
          </Typography>
        </Box>
      ) : (
        <>
          {isSmallScreen ? (
            <Stack spacing={2}>
              {pets.map((pet) => (
                <Box key={pet._id} display="flex" justifyContent="center">
                  <PetCard
                    name={pet.name}
                    owner={pet.owner}
                    fullData={pet}
                    id={pet._id}
                    handleViewClicked={handleViewClicked}
                    refreshPets={refreshPets}
                  />
                </Box>
              ))}
            </Stack>
          ) : (
            <Grid container spacing={2}>
              {pets.map((pet) => (
                <Grid key={pet._id} item xs={12} sm={6} md={4}>
                  <PetCard
                    name={pet.name}
                    owner={pet.owner}
                    fullData={pet}
                    id={pet._id}
                    handleViewClicked={handleViewClicked}
                    refreshPets={refreshPets}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </>
  );
};
