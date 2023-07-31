import ReactApexChart from "react-apexcharts";

const TasksChart: React.FC = () => {
  let options = {
    chart: {},
    colors: ["#faa05f"],
  };

  const series = [
    {
      name: "All Tasks",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
  ];

  return (
    <ReactApexChart
      type="area"
      options={options}
      series={series}
      height={350}
    />
  );
};

export default TasksChart;
