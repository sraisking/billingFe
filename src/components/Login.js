// Login.js
import React, { useEffect, useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { Link, Navigate } from "react-router-dom";
import { login } from "../redux/authThunks";
import CustomLoader from "./CustomLoader";

export const Login = () => {

  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    dispatch(login(username, password));
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "30vh",
        flexDirection: "column",
      }}
    >
      <Stack spacing={2} width="300px">
        {" "}
        {/* Added spacing between elements */}
        <TextField
          variant="outlined"
          label="User Name"
          disabled={loading}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          variant="outlined"
          label="Password"
          type="password"
          value={password}
          disabled={loading}
          onChange={(e) => setPassword(e.target.value)}
        />
        {loading && <CustomLoader />}
        <Button
          variant="outlined"
          onClick={handleLogin}
          disabled={loading}
          sx={{ backgroundColor: "secondary.main" }}
        >
          Sign in
        </Button>
        {error && (
          <Button
            component={Link}
            to="/signup"
            variant="outlined"
            sx={{ backgroundColor: "secondary.main", mt: 1 }} // Adjust margin-top for spacing
          >
            Sign up
          </Button>
        )}
        {error && <p>Try Signing in with Right Credentials</p>}
      </Stack>
    </Box>
  );
};
