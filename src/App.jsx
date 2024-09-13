import { Layout } from 'antd';
import Left from "./components/Left.jsx";
import Right from "./components/Right.jsx";
import "./css/App.css";

import RouterConfig from "./router/index.jsx"

const { Content } = Layout;

function App() {
  return (
    <div className="App">
      <div className="left-sidebar">
        <Left />
      </div>
      <Content className="content">
        <RouterConfig />
      </Content>
      <div className="right-sidebar">
        <Right />
      </div>
    </div>
  )
}

export default App;