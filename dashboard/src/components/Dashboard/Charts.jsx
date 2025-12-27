import { Box, Grid, Typography, Paper } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function Charts({ data }) {
  if (!data) {
    return <Typography color="textSecondary">No chart data available</Typography>;
  }

  return (
    <Grid container spacing={3}>
      {/* MD Visits by Date */}
      {data.mdVisitsByDate && data.mdVisitsByDate.length > 0 && (
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              MD Visits (Last 7 Days)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.mdVisitsByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1976d2" name="MD Visits" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      )}

      {/* Sales Visits by Date */}
      {data.salesVisitsByDate && data.salesVisitsByDate.length > 0 && (
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sales Visits (Last 7 Days)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.salesVisitsByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#2e7d32" name="Sales Visits" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      )}

      {/* MD Visits by Warehouse */}
      {data.mdVisitsByWarehouse && data.mdVisitsByWarehouse.length > 0 && (
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              MD Visits by Warehouse
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.mdVisitsByWarehouse}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.warehouse}: ${entry.count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.mdVisitsByWarehouse.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      )}

      {/* Sales Visits by Warehouse */}
      {data.salesVisitsByWarehouse && data.salesVisitsByWarehouse.length > 0 && (
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sales Visits by Warehouse
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.salesVisitsByWarehouse}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.warehouse}: ${entry.count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.salesVisitsByWarehouse.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      )}

      {/* POSM Status Distribution */}
      {data.posmStats && data.posmStats.length > 0 && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              POSM Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.posmStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status_posm" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#ed6c02" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
}

export default Charts;
