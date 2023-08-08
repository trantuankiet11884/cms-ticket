import { DatePicker } from "antd";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";

const TasksChart: React.FC = () => {
  const [fTicket, setFTicket] = useState(0);
  const [fuTicket, setFuTicket] = useState(0);
  const [euTicket, setEuTicket] = useState(0);
  const [eTicket, setETicket] = useState(0);
  const [price, setPrice] = useState<number>(0);
  const [total, setTotal] = useState(0);

  const dataTicketEvent = useSelector(
    (state: RootState) => state.ticketEvent.ticketEvents
  );
  const dataTicket = useSelector((state: RootState) => state.ticket.tickets);

  useEffect(() => {
    const uticket = dataTicket.filter(
      (item) => item.status === "Đã sử dụng"
    ).length;
    const pticket = dataTicket.filter(
      (item) => item.status === "Chưa sử dụng"
    ).length;

    const prices = dataTicket.filter((item: any) => item.price);

    const euticket = dataTicketEvent.filter(
      (item) => item.status === "Đã sử dụng"
    ).length;
    const peticket = dataTicketEvent.filter(
      (item) => item.status === "Chưa sử dụng"
    ).length;

    const totalRevenue = dataTicket.reduce((acc, cur: any) => {
      return acc + (cur.price || 0);
    }, 0);

    setFTicket(pticket);
    setFuTicket(uticket);
    setEuTicket(euticket);
    setETicket(peticket);
    setPrice(prices.length > 0 ? Number(prices[0].price) : 0);
    setTotal(totalRevenue);
  }, [dataTicket, dataTicketEvent]);

  const options = {
    chart: {},
    colors: ["#faa05f"],
  };

  const series = [
    {
      name: "Doanh thu",
      data: [125, 400, 250],
    },
  ];

  const options2 = {
    labels: ["Vé đã sử dụng", "Vé chưa sử dụng"],
    chart: {},
  };

  const series2 = [fuTicket, fTicket];

  const options3 = {
    labels: ["Vé đã sử dụng", "Vé chưa sử dụng"],
    chart: {},
  };

  const series3 = [euTicket, eTicket];

  return (
    <>
      <div className="flex justify-end mb-2">
        <DatePicker />
      </div>
      <ReactApexChart
        type="area"
        options={options}
        series={series}
        height={250}
      />
      <p>
        <span className="">Doanh thu:</span>
        <p className="econ">{total} tr</p>
      </p>
      <div className="flex justify-center">
        <div className="flex flex-col">
          <label htmlFor="">Gói gia đình</label>
          <ReactApexChart
            type="donut"
            options={options2}
            series={series2}
            height={100}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="">Gói sự kiện</label>
          <ReactApexChart
            type="donut"
            options={options3}
            series={series3}
            height={100}
          />
        </div>
      </div>
    </>
  );
};

export default TasksChart;
