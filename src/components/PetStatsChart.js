// components/PetStatsChart.jsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#66bb6a", "#ffca28", "#ef5350"];

export const PetStatsChart = ({ data }) => {
  const chartData = [
    { name: "Paid", value: data.paid },
    { name: "Partially Paid", value: data.partiallyPaid },
    { name: "Unpaid", value: data.unpaid },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          label
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
};
