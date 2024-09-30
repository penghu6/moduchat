import { Layout } from 'antd';
import Left from "./components/left.jsx";
import Right from "./components/right.jsx";
import Content from "./components/content.jsx";
import Test from "./components/test.jsx";
import "./css/App.css";

import RouterConfig from "./router/index.jsx"
import Home from "./pages/home.jsx"

const { Content: AntdContent } = Layout;

function App() {
  return (
    <Home />
  )
}

export default App;