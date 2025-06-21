// PetCard.js
import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useTheme } from "@emotion/react";

const PetCard = ({
  picture,
  name,
  id,
  owner,
  fullData,
  handleViewClicked,
  refreshPets,
}) => {
  // Use a placeholder image if picture is not provided
  const navigate = useNavigate();
  console.log(fullData);
  const handleClick = (e) => {
    handleViewClicked(id);
    // navigate(`pet/${id}`)
  };
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const handleDelete = async () => {
    try {
      // Make DELETE request to delete pet by ID
      await api.delete(`/pets/${id}`);
      refreshPets();
      // Refresh the list of pets after deletion
      console.log(`Pet with ID ${id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting pet:", error);
      // Optionally, show an error message or handle error states
    }
  };

  return (
    <Card sx={{ maxWidth: isSmallScreen ? 145 : 345, margin: 2 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Owner: {owner}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Expenses: {fullData?.totalExpense}
        </Typography>
        {fullData?.paid && (
          <Typography variant="body2" color="text.secondary">
            Payments are settled
          </Typography>
        )}
        {!fullData?.paid && (
          <Typography variant="body2" color="text.secondary">
            Payments are Not settled
          </Typography>
        )}
        {fullData?.partiallypaid?.isPartiallyPaid && (
          <Typography variant="body2" color="text.secondary">
            Rs {fullData?.partiallypaid?.isPartiallyPaid?.amount} has been paid
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={handleClick}
        >
          View
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default PetCard;
