// PetCard.js
import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";

const PetCard = ({ picture, name, id, owner, handleViewClicked, refreshPets }) => {
  // Use a placeholder image if picture is not provided
  const navigate = useNavigate();
  
  const handleClick = (e) => {
    handleViewClicked(id);
    // navigate(`pet/${id}`)
  };
 

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
    <Card sx={{ maxWidth: 345, margin: 2 }}>
      <CardMedia component="img" height="140" image={'cat.jpg'} alt={name} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Owner: {owner}
        </Typography>
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
        <Button size="small" variant="contained" color="error" onClick={handleDelete}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default PetCard;