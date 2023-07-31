import React from "react";
import TasksChart from "../components/TaskChart";

type Props = {};

const Dashboard = (props: Props) => {
  return (
    <div className="p-4 pt-0 h-full">
      <div className="bg-white h-full p-2 rounded-lg">
        <p className="title">Thống kê</p>
        <div>
          <TasksChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
