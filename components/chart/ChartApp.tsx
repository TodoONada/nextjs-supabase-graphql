"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

export default function ChartApp(props: { title: string; chartData: any }) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: props.title,
      },
    },
  };

  console.log(props.chartData);

  if (props.chartData != undefined) {
    return (
      <div>
        <Bar options={options} data={props.chartData} />
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}
