import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
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
  useMediaQuery,
  Select,
  InputLabel,
  TablePagination,
  LinearProgress,
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
import { useTheme } from "@emotion/react";
import FormControl from '@mui/material/FormControl';

dayjs.extend(isBetween);

const COLORS = ["#66bb6a", "#ffca28", "#ef5350", "#42a5f5"];

export const Expenses = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    paymentType: "Cash",
  });

  const [expenses, setExpenses] = useState([]);
  const [fullDataCopy, setFullDataCopy] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [total, setTotal] = useState(0);

  const fixedCategories = [
    "transport",
    "rte food supplies",
    "office supplies",
    "salary",
    "treatment",
    "electricity",
  ];

  const fetchExpenses = async (page, limit) => {
    setLoading(true);
    const res = await api.get(`/expenses?page=${page}&limit=${limit}`);
    setExpenses(res.data.data);
    setTotal(res.data.total);
    setLoading(false);
  };

  // Fetch all expenses once for analytics (no pagination)
  const fetchAllExpenses = async () => {
    const res = await api.get(`/expenses?page=0&limit=10000`); // Adjust limit as needed
    setFullDataCopy(res.data.data);
  };

  useEffect(() => {
    fetchExpenses(page, rowsPerPage);
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchAllExpenses();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/expenses", formData);
    fetchExpenses(page, rowsPerPage);
    fetchAllExpenses();
    setFormData({
      category: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      paymentType: "Cash",
    });
  };

  // Filter expenses based on date filters for paginated data
  const filteredExpenses = expenses?.filter((exp) => {
    const date = dayjs(exp.date);
    if (startDate && !endDate) return date.isSameOrAfter(startDate);
    if (!startDate && endDate) return date.isSameOrBefore(endDate);
    if (startDate && endDate)
      return date.isBetween(startDate, endDate, null, "[]");
    return true;
  });

  // Same filters on fullDataCopy for analytics (so analytics reflect filters)
  const filteredFullData = fullDataCopy?.filter((exp) => {
    const date = dayjs(exp.date);
    if (startDate && !endDate) return date.isSameOrAfter(startDate);
    if (!startDate && endDate) return date.isSameOrBefore(endDate);
    if (startDate && endDate)
      return date.isBetween(startDate, endDate, null, "[]");
    return true;
  });

  // Group categories with unknown ones as "Others" (case insensitive)
  const categoryDataObj = filteredFullData?.reduce((acc, e) => {
    const lowerCategory = (e.category || "").toLowerCase();
    const matchedCategory = fixedCategories.includes(lowerCategory)
      ? lowerCategory.charAt(0).toUpperCase() + lowerCategory.slice(1)
      : "Others";
    acc[matchedCategory] = (acc[matchedCategory] || 0) + e.amount;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryDataObj || {}).map(([name, value]) => ({
    name,
    value,
  }));

  // Analytics calculations
  const totalSpent = filteredFullData.reduce((acc, e) => acc + e.amount, 0);

  const paymentTotals = filteredFullData.reduce((acc, e) => {
    const key = e.paymentType || "Unknown";
    acc[key] = (acc[key] || 0) + e.amount;
    return acc;
  }, {});

  const biggestTransaction = filteredFullData.reduce(
    (max, e) => (e.amount > max.amount ? e : max),
    { amount: 0 }
  );

  const biggestCategory = Object.entries(categoryDataObj || {}).reduce(
    (max, curr) => (curr[1] > max[1] ? curr : max),
    ["None", 0]
  );

  const dates = filteredFullData.map((e) => dayjs(e.date));
  const earliest = dates.length
  ? dayjs(Math.min(...dates.map(d => d.valueOf())))
  : null;
const latest = dates.length
  ? dayjs(Math.max(...dates.map(d => d.valueOf())))
  : null;
  const days = earliest && latest ? latest.diff(earliest, "day") + 1 : 1;
  const avgPerDay = totalSpent / days;

  const paymentSplit = Object.entries(paymentTotals).map(([key, value]) => ({
    name: key,
    percent: ((value / totalSpent) * 100).toFixed(1) + "%",
  }));

  // Export to Excel uses filtered paginated data
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

  return (
    <Stack spacing={4} sx={{ padding: theme.spacing(2) }}>
      <Typography variant="h4" align="center">
        Expense Tracker
      </Typography>

      {/* Audit Insights */}
      <Stack spacing={2} direction="row" flexWrap="wrap" justifyContent="center">
        <Paper sx={{ padding: 2, minWidth: 180, textAlign: "center" }}>
          <Typography variant="subtitle1">Total Spent</Typography>
          <Typography variant="h6">₹{totalSpent.toLocaleString()}</Typography>
        </Paper>
        <Paper sx={{ padding: 2, minWidth: 180, textAlign: "center" }}>
          <Typography variant="subtitle1">Biggest Transaction</Typography>
          <Typography variant="body2">
            ₹{biggestTransaction.amount || 0} in {biggestTransaction.category || "-"}
          </Typography>
        </Paper>
        <Paper sx={{ padding: 2, minWidth: 180, textAlign: "center" }}>
          <Typography variant="subtitle1">Top Category</Typography>
          <Typography variant="body2">
            {biggestCategory[0]} (₹{biggestCategory[1]})
          </Typography>
        </Paper>
        <Paper sx={{ padding: 2, minWidth: 180, textAlign: "center" }}>
          <Typography variant="subtitle1">Avg Spend/Day</Typography>
          <Typography variant="body2">
            ₹{avgPerDay.toFixed(2)} over {days} day{days > 1 ? "s" : ""}
          </Typography>
        </Paper>
        <Paper sx={{ padding: 2, minWidth: 180, textAlign: "center" }}>
          <Typography variant="subtitle1">Payment Methods</Typography>
          {paymentSplit.map((p) => (
            <Typography key={p.name} variant="body2">
              {p.name}: {p.percent}
            </Typography>
          ))}
        </Paper>
      </Stack>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Stack
          spacing={2}
          direction={isSmallScreen ? "column" : "row"}
          flexWrap="wrap"
          justifyContent="center"
        >
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category-select"
                value={formData.category}
                label="Category"
                name="category"
                onChange={handleChange}
              >
                <MenuItem value={"Transport"}>Transport</MenuItem>
                <MenuItem value={"RTE Food Supplies"}>RTE Food Supplies</MenuItem>
                <MenuItem value={"Office Supplies"}>Office Supplies</MenuItem>
                <MenuItem value={"SALARY"}>SALARY</MenuItem>
                <MenuItem value={"TREATMENT"}>TREATMENT</MenuItem>
                <MenuItem value={"ELECTRICITY"}>ELECTRICITY</MenuItem>
                <MenuItem value={"Others"}>Others</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TextField
            fullWidth={isSmallScreen}
            label="Amount"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth={isSmallScreen}
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            fullWidth={isSmallScreen}
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth={isSmallScreen}
            select
            name="paymentType"
            label="Payment Type"
            value={formData.paymentType}
            onChange={handleChange}
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Online">Online</MenuItem>
          </TextField>
          <Button variant="contained" type="submit" fullWidth={isSmallScreen}>
            Add
          </Button>
        </Stack>
      </form>

      {/* Filters */}
      <Stack
        direction={isSmallScreen ? "column" : "row"}
        spacing={2}
        alignItems="center"
        justifyContent="center"
      >
        <TextField
          fullWidth={isSmallScreen}
          type="date"
          label="From"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          fullWidth={isSmallScreen}
          type="date"
          label="To"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button
          fullWidth={isSmallScreen}
          onClick={handleExport}
          variant="outlined"
          color="success"
        >
          Export to Excel
        </Button>
      </Stack>

      {/* Charts */}
      <Stack
        direction={isSmallScreen ? "column" : "row"}
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <ResponsiveContainer width={isSmallScreen ? "100%" : "45%"} height={250}>
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

        <ResponsiveContainer width={isSmallScreen ? "100%" : "45%"} height={250}>
          <PieChart>
            <Pie
              data={Object.entries(paymentTotals).map(([name, value]) => ({ name, value }))}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {Object.entries(paymentTotals).map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Stack>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          overflowX: "auto",
          width: "100%",
          maxWidth: isSmallScreen ? "100%" : "80%",
          alignSelf: "center",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={5}>
                  <LinearProgress />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
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
          )}
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Stack>
  );
};
