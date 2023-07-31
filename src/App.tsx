import Layout, { Content } from "antd/es/layout/layout";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ManageTicket from "./pages/ManageTicket";
import ComparisonTicket from "./pages/ComparisonTicket";
import PackageService from "./pages/PackageService";

function App() {
  return (
    <div className="app">
      <Layout className="layout">
        <Sidebar></Sidebar>
        <Layout>
          <Header></Header>
          <Content>
            <Routes>
              <Route path="/" element={<Dashboard />}></Route>
              <Route path="/manage-ticket" element={<ManageTicket />}></Route>
              <Route
                path="/comparison-ticket"
                element={<ComparisonTicket />}
              ></Route>
              <Route
                path="/package-service"
                element={<PackageService />}
              ></Route>
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
