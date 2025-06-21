import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import api from "../api";

export const ViewOrEditPet = () => {
  const { id } = useParams();

  const [petData, setPetData] = useState({
    _id: "",
    name: "",
    owner: "",
    expenses: [{ item: "", cost: 0 }],
    dateOfAdmission: "",
    dateOfDischarge: "",
    spotOnStatus: "pending",
    spotOnDate: "",
    dewormingStatus: "pending",
    dewormingDate: "",
    vaccinationStatus: "pending",
    vaccinationDate: "",
    contact: "",
    reasonOfAdmission: "",
    paid: false,
    partiallyPaid: {
      isPartiallyPaid: false,
      amount: 0,
    },
  });

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [pdfSnackbarOpen, setPdfSnackbarOpen] = useState(false);
  const [pdfErrorSnackbarOpen, setPdfErrorSnackbarOpen] = useState(false);
  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const response = await api.get(`/pets/${id}`);
        const petData = response.data;
        setPetData({
          ...petData,
          dateOfAdmission: petData.dateOfAdmission
            ? new Date(petData.dateOfAdmission).toISOString().split("T")[0]
            : "",
          dateOfDischarge: petData.dateOfDischarge
            ? new Date(petData.dateOfDischarge).toISOString().split("T")[0]
            : "",
          spotOnDate: petData.spotOnDate
            ? new Date(petData.spotOnDate).toISOString().split("T")[0]
            : "",
          dewormingDate: petData.dewormingDate
            ? new Date(petData.dewormingDate).toISOString().split("T")[0]
            : "",
          vaccinationDate: petData.vaccinationDate
            ? new Date(petData.vaccinationDate).toISOString().split("T")[0]
            : "",
        });
      } catch (error) {
        console.error("Error fetching pet data:", error);
      }
    };
    fetchPetData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetData({ ...petData, [name]: value });
  };

  const handleGenerateInvoice = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/pets/${id}/download-pdf`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `pet_${id}_invoice.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setPdfSnackbarOpen(true);
    } catch (error) {
      console.error("Error generating invoice:", error);
      setPdfErrorSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateAllFields = async () => {
    setLoading(true);
    try {
      const response = await api.put(`/pets/${petData._id}`, petData);
      console.log("Pet updated successfully:", response.data);
      setOpenSnackbar(true);
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating pet:", error);
      setErrorSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
    setErrorSnackbarOpen(false);
    setPdfSnackbarOpen(false);
    setPdfErrorSnackbarOpen(false);
  };

  const handleExpenseChange = (index, field, value) => {
    const updatedExpenses = [...petData.expenses];
    updatedExpenses[index][field] = value;
    setPetData({ ...petData, expenses: updatedExpenses });
  };

  const handleAddExpense = () => {
    setPetData({
      ...petData,
      expenses: [...petData.expenses, { item: "", cost: 0 }],
    });
  };

  const handleRemoveExpense = (index) => {
    const updatedExpenses = petData.expenses.filter((_, i) => i !== index);
    setPetData({ ...petData, expenses: updatedExpenses });
  };

  const getPaymentStatusValue = () => {
    if (petData.paid) return "paid";
    if (petData?.partiallyPaid?.isPartiallyPaid) return "isPartiallyPaid";
    return "unpaid";
  };
    const handlePaymentStatus = (e) => {
    const { name, value } = e.target;
    if (value === "paid") {
      setPetData({
        ...petData,
        [name]: true,
        partiallyPaid: {
          isPartiallyPaid: false,
        },
      });
    } else if (value === "isPartiallyPaid") {
      setPetData({
        ...petData,
        [name]: false,
        partiallyPaid: {
          isPartiallyPaid: true,
        },
      });
    } else {
      setPetData({
        ...petData,
        [name]: false,
        partiallyPaid: {
          isPartiallyPaid: false,
        },
      });
    }
  };
  const handlePartialPayment = (e) => {
    const { name, value } = e.target;
    setPetData({
      ...petData,
      [name]: {
        isPartiallyPaid: true,
        amount: value,
      },
    });
  };
  return (
    <Container>
      <Typography variant="h4">Pet Detail View</Typography>
      <Stack spacing={2}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={petData.name}
          onChange={handleChange}
          disabled={!isEditMode}
        />
        <TextField
          fullWidth
          label="Owner"
          name="owner"
          value={petData.owner}
          onChange={handleChange}
          disabled={!isEditMode}
        />
        <TextField
          fullWidth
          type="date"
          label="Date of Admission"
          name="dateOfAdmission"
          value={petData.dateOfAdmission}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          disabled={!isEditMode}
        />
        <TextField
          fullWidth
          type="date"
          label="Date of Discharge"
          name="dateOfDischarge"
          value={petData.dateOfDischarge}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          disabled={!isEditMode}
        />
        <TextField
          fullWidth
          label="Contact"
          name="contact"
          value={petData.contact}
          onChange={handleChange}
          disabled={!isEditMode}
        />
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Reason of Admission"
          name="reasonOfAdmission"
          value={petData.reasonOfAdmission}
          onChange={handleChange}
          disabled={!isEditMode}
        />
        <FormControl fullWidth disabled={!isEditMode}>
          <InputLabel>Spot On Status</InputLabel>
          <Select
            name="spotOnStatus"
            value={petData.spotOnStatus}
            onChange={handleChange}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          type="date"
          label="Spot On Date"
          name="spotOnDate"
          value={petData.spotOnDate}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          disabled={!isEditMode}
        />
        <FormControl fullWidth disabled={!isEditMode}>
          <InputLabel>Deworming Status</InputLabel>
          <Select
            name="dewormingStatus"
            value={petData.dewormingStatus}
            onChange={handleChange}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          type="date"
          label="Deworming Date"
          name="dewormingDate"
          value={petData.dewormingDate}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          disabled={!isEditMode}
        />
        <FormControl fullWidth disabled={!isEditMode}>
          <InputLabel>Vaccination Status</InputLabel>
          <Select
            name="vaccinationStatus"
            value={petData.vaccinationStatus}
            onChange={handleChange}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          type="date"
          label="Vaccination Date"
          name="vaccinationDate"
          value={petData.vaccinationDate}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          disabled={!isEditMode}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {petData.expenses.map((expense, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      name="item"
                      value={expense.item}
                      onChange={(e) =>
                        handleExpenseChange(index, "item", e.target.value)
                      }
                      disabled={!isEditMode}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="cost"
                      type="number"
                      value={expense.cost}
                      onChange={(e) =>
                        handleExpenseChange(index, "cost", e.target.value)
                      }
                      disabled={!isEditMode}
                    />
                  </TableCell>
                  <TableCell>
                    {isEditMode && (
                      <IconButton onClick={() => handleRemoveExpense(index)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {isEditMode && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddExpense}
                      startIcon={<AddIcon />}
                    >
                      Add Expense
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <FormControl fullWidth>
          <InputLabel>Is you expenses Paid?</InputLabel>
          <Select
            name="paid"
            value={getPaymentStatusValue()}
            onChange={handlePaymentStatus}
          >
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="isPartiallyPaid">Partially Paid</MenuItem>
            <MenuItem value="unpaid">Unpaid</MenuItem>
          </Select>
        </FormControl>
        {petData.partiallyPaid?.isPartiallyPaid && (
          <TextField
            fullWidth
            label="Please enter the partially paid amount"
            name="partiallyPaid"
            value={petData.partiallyPaid.amount}
            onChange={handlePartialPayment}
            InputLabelProps={{
              shrink: true,
            }}
          />
        )}
        {isEditMode ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateAllFields}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Update All Fields"}
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleEditClick}>
            Edit
          </Button>
        )}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleGenerateInvoice}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Generate Invoice"}
        </Button>
      </Stack>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Pet details updated successfully.
        </Alert>
      </Snackbar>
      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          Error updating pet. Please try again later.
        </Alert>
      </Snackbar>
      <Snackbar
        open={pdfSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Invoice generated successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={pdfErrorSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          Error generating invoice!
        </Alert>
      </Snackbar>
    </Container>
  );
};
