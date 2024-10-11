import { Layout } from 'antd';
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