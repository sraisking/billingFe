import React, { useState } from "react";
import {
  Container,
  CssBaseline,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead of useHistory
import api from "../api";

export const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Use useNavigate hook

  const handleSignup = async () => {
    try {
      //   const response = await fetch("/signup", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({ username, password }),
      //   });
      const response = await api.post("/signup", { username, password });
      console.log(response);
      if (response.status === 201) {
        navigate("/login"); // Redirect to login page after successful signup
      } else {
        const data = await response.json();
        console.log(response);
        setError(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      //   setError("Signup failed");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography variant="body2" color="error" align="center">
              {error}
            </Typography>
          )}
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSignup}
          >
            Sign Up
          </Button>
        </form>
      </div>
    </Container>
  );
};
