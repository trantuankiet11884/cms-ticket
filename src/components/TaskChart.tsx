import { DatePicker } from "antd";
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

  const series2 = [17, 15];

  let options2 = {
    chart: {},
    color: ["#fff"],
  };

  const series3 = [44, 55];

  let options3 = {
    chart: {},
  };
  return (
    <>
      <div className="flex justify-end mb-2">
        <DatePicker></DatePicker>
      </div>
      <ReactApexChart
        type="area"
        options={options}
        series={series}
        height={300}
      />
      <div className="flex">
        <ReactApexChart
          type="donut"
          options={options2}
          series={series2}
          height={130}
        />
        <ReactApexChart
          type="donut"
          options={options3}
          series={series3}
          height={130}
        />
      </div>
    </>
  );
};

export default TasksChart;
