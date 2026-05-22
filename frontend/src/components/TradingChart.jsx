import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TradingChart = ({ data = [], symbol = "N/A", timeframe = "" }) => {

  // ✅ SAFE DATA FILTER
  const safeData = Array.isArray(data) ? data.filter(d => d && d.Close) : [];

  const chartData = {
    labels: safeData.map(d =>
      d?.Datetime ? new Date(d.Datetime).toLocaleTimeString() : ""
    ),
    datasets: [
      {
        label: `${symbol} Price`,
        data: safeData.map(d => d?.Close || 0),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Volume',
        data: safeData.map(d => d?.Volume || 0),
        type: 'bar',
        backgroundColor: 'rgba(34, 197, 94, 0.3)',
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        grid: { color: 'rgba(255,255,255,0.1)' },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: { color: 'rgba(255,255,255,0.1)' },
      },
      y1: {
        type: 'linear',
        display: false,
        position: 'right',
      },
    },
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: `${symbol || "Stock"} - ${timeframe || ""}`,
        color: 'white',
      },
    },
  };

  // ✅ PREVENT CRASH (NO DATA CASE)
  if (!safeData.length) {
    return (
      <div className="text-white text-center p-10">
        No data available / Loading...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl"
    >
      <div className="h-96">
        <Line data={chartData} options={options} />
      </div>
    </motion.div>
  );
};

export default TradingChart;