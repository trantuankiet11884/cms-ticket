import React, { useState } from "react";
import {
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { logo } from "../assets/js";
import { Link, useNavigate } from "react-router-dom";

type MenuItem = {
  key: string;
  icon: React.ReactNode;
  label: React.ReactNode;
  path?: string;
  children?: MenuItem[];
};

function getItem(
  label: React.ReactNode,
  key: string,
  icon: React.ReactNode,
  path?: string,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    label,
    path,
    children,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Trang chủ", "/", <DesktopOutlined />, "/"),
  getItem(
    "Quản lý vé",
    "/manage-ticket",
    <ContainerOutlined />,
    "/manage-ticket"
  ),
  getItem(
    "Đối soát vé",
    "/comparison-ticket",
    <MailOutlined />,
    "/comparison-ticket"
  ),
  getItem("Cài đặt", "4", <PieChartOutlined />, "", [
    getItem("Gói dịch vụ", "/package-service", "", "/package-service"),
  ]),
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleMenuClick = (event: any) => {
    navigate(event.key);
  };
  return (
    <>
      <Sider className="h-full ">
        <div className=" p-4 pb-14">
          <Link to="/">
            <img src={logo} alt="logo" className="logo" />
          </Link>
        </div>
        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
          items={items}
          onClick={handleMenuClick}
        />
        <div className="copyright text-center">
          <p>Copyright © 2020 Alta Software </p>
        </div>
      </Sider>
    </>
  );
};

export default Sidebar;
