// ExpenseTracker.jsx
import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Stack,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import api from "../api";

dayjs.extend(isBetween);

const COLORS = ["#66bb6a", "#ffca28", "#ef5350", "#42a5f5"];

export const Expenses = () => {
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    paymentType: "Cash",
  });

  const [expenses, setExpenses] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchExpenses = async () => {
    const res = await api.get("/expenses");
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/expenses", formData);
    fetchExpenses();
    setFormData({
      category: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      paymentType: "Cash",
    });
  };

  const filteredExpenses = expenses.filter((exp) => {
    const date = dayjs(exp.date);
    if (startDate && !endDate) return date.isSameOrAfter(startDate);
    if (!startDate && endDate) return date.isSameOrBefore(endDate);
    if (startDate && endDate)
      return date.isBetween(startDate, endDate, null, "[]");
    return true;
  });

  const handleExport = () => {
    const formatted = filteredExpenses.map((e) => ({
      Date: new Date(e.date).toLocaleDateString(),
      Category: e.category,
      Amount: e.amount,
      "Payment Type": e.paymentType,
      Description: e.description,
      Attachment: e.attachment?.filename || "",
      ReferenceID: e.referenceId || "",
    }));

    const ws = XLSX.utils.json_to_sheet(formatted);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    XLSX.writeFile(
      wb,
      `Expenses-${startDate || "all"}_to_${endDate || "today"}.xlsx`
    );
  };

  const categoryData = Object.entries(
    filteredExpenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const paymentData = Object.entries(
    filteredExpenses.reduce((acc, e) => {
      acc[e.paymentType] = (acc[e.paymentType] || 0) + e.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <Stack spacing={4}>
      <Typography variant="h4" align="center">
        Expense Tracker
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack
          spacing={2}
          direction={{ xs: "column", sm: "row" }}
          flexWrap="wrap"
        >
          <TextField
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <TextField
            label="Amount"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            name="paymentType"
            label="Payment Type"
            value={formData.paymentType}
            onChange={handleChange}
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Online">Online</MenuItem>
          </TextField>
          <Button variant="contained" type="submit">
            Add
          </Button>
        </Stack>
      </form>

      <Stack direction="row" spacing={2}>
        <TextField
          type="date"
          label="From"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          type="date"
          label="To"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button onClick={handleExport} variant="outlined" color="success">
          Export to Excel
        </Button>
      </Stack>

      <Stack direction="row" spacing={4} justifyContent="center">
        <ResponsiveContainer width="45%" height={250}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {categoryData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="45%" height={250}>
          <PieChart>
            <Pie
              data={paymentData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {paymentData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExpenses.map((e) => (
              <TableRow key={e._id}>
                <TableCell>{new Date(e.date).toLocaleDateString()}</TableCell>
                <TableCell>{e.category}</TableCell>
                <TableCell>₹{e.amount}</TableCell>
                <TableCell>{e.paymentType}</TableCell>
                <TableCell>{e.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
