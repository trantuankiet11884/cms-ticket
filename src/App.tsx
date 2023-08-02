import Layout, { Content } from "antd/es/layout/layout";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Routerr from "./routes";

function App() {
  return (
    <div className="app">
      <Layout className="layout">
        <Sidebar></Sidebar>
        <Layout>
          <Header></Header>
          <Content>
            <Routerr />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
