
import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ManageTicket from "../pages/ManageTicket";
import ComparisonTicket from "../pages/ComparisonTicket";
import PackageService from "../pages/PackageService";

const Routerr = () => {
  return (
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
  )
}

export default Routerr