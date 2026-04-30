import { Line, Chart as ChartJS } from 'react-chartjs-2';
import {
  Chart as ChartJS2,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS2.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TradingChart = ({ data, symbol, timeframe }) => {
  const chartData = {
    labels: data?.map(d => new Date(d.Datetime).toLocaleTimeString()) || [],
    datasets: [
      {
        label: `${symbol} Price`,
        data: data?.map(d => d.Close) || [],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Volume',
        data: data?.map(d => d.Volume) || [],
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
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${symbol} - ${timeframe}`,
        color: 'white',
      },
    },
  };

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