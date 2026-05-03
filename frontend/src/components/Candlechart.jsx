import React from "react";
import Chart from "react-apexcharts";

function CandleChart({ data }) {

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          color: "#94a3b8",
          textAlign: "center",
          padding: "40px"
        }}
      >
        No chart data available
      </div>
    );
  }

  const seriesData = data.map((item) => ({
    x: new Date(item.date),
    y: [
      item.open || item.close,
      item.high || item.close,
      item.low || item.close,
      item.close
    ]
  }));

  const options = {
    chart: {
      type: "candlestick",
      toolbar: {
        show: true
      },
      background: "#1e293b"
    },

    theme: {
      mode: "dark"
    },

    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#94a3b8"
        }
      }
    },

    yaxis: {
      tooltip: {
        enabled: true
      },
      labels: {
        style: {
          colors: "#94a3b8"
        }
      }
    },

    grid: {
      borderColor: "#334155"
    }
  };

  const series = [
    {
      data: seriesData
    }
  ];

  return (
    <div>
      <Chart
        options={options}
        series={series}
        type="candlestick"
        height={400}
      />
    </div>
  );
}

export default CandleChart;