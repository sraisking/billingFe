import React, { useState } from 'react';
import { 
  Container, Typography, TextField, Button, Stack, 
  FormControl, InputLabel, Select, MenuItem, Snackbar, Alert, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  IconButton, CircularProgress 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../api';

export const AddPet = () => {
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    expenses: [{ item: '', cost: 0 }],
    dateOfAdmission: '',
    dateOfDischarge: '',
    spotOnStatus: 'pending',
    spotOnDate: '',
    dewormingStatus: 'pending',
    dewormingDate: '',
    vaccinationStatus: 'pending',
    vaccinationDate: '',
    contact: '',
    reasonOfAdmission: '',
  });

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleExpenseChange = (index, field, value) => {
    const updatedExpenses = [...formData.expenses];
    updatedExpenses[index][field] = value;
    setFormData({ ...formData, expenses: updatedExpenses });
  };

  const handleAddExpense = () => {
    setFormData({ ...formData, expenses: [...formData.expenses, { item: '', cost: 0 }] });
  };

  const handleRemoveExpense = (index) => {
    const updatedExpenses = formData.expenses.filter((_, i) => i !== index);
    setFormData({ ...formData, expenses: updatedExpenses });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/pets', formData);
      console.log('Pet added successfully:', response.data);
      setOpenSnackbar(true);
      setFormData({
        name: '',
        owner: '',
        expenses: [{ item: '', cost: 0 }],
        dateOfAdmission: '',
        dateOfDischarge: '',
        spotOnStatus: 'pending',
        spotOnDate: '',
        dewormingStatus: 'pending',
        dewormingDate: '',
        vaccinationStatus: 'pending',
        vaccinationDate: '',
        contact: '',
        reasonOfAdmission: '',
      });
    } catch (error) {
      console.error('Error adding pet:', error);
      setErrorSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
    setErrorSnackbarOpen(false);
  };

  return (
    <Container >
      <Typography variant="h4">Add Pet View</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Owner"
            name="owner"
            value={formData.owner}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            type="date"
            label="Date of Admission"
            name="dateOfAdmission"
            value={formData.dateOfAdmission}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            type="date"
            label="Date of Discharge"
            name="dateOfDischarge"
            value={formData.dateOfDischarge}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            label="Contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reason of Admission"
            name="reasonOfAdmission"
            value={formData.reasonOfAdmission}
            onChange={handleChange}
          />
          <FormControl fullWidth>
            <InputLabel>Spot On Status</InputLabel>
            <Select
              name="spotOnStatus"
              value={formData.spotOnStatus}
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
            value={formData.spotOnDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth>
            <InputLabel>Deworming Status</InputLabel>
            <Select
              name="dewormingStatus"
              value={formData.dewormingStatus}
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
            value={formData.dewormingDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth>
            <InputLabel>Vaccination Status</InputLabel>
            <Select
              name="vaccinationStatus"
              value={formData.vaccinationStatus}
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
            value={formData.vaccinationDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Typography variant="h6">Expenses</Typography>
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
                {formData.expenses.map((expense, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TextField
                        name="item"
                        value={expense.item}
                        onChange={(e) => handleExpenseChange(index, 'item', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="cost"
                        type="number"
                        value={expense.cost}
                        onChange={(e) => handleExpenseChange(index, 'cost', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleRemoveExpense(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
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
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </Stack>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Pet has been successfully added to YCF database
        </Alert>
      </Snackbar>
      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          Error adding pet. Please try again later.
        </Alert>
      </Snackbar>
    </Container>
  );
};

 
