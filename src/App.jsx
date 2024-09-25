import { Layout } from 'antd';
import Left from "./components/left.jsx";
import Right from "./components/right.jsx";
import Content from "./components/content.jsx";
import Test from "./components/test.jsx";
import "./css/App.css";

import RouterConfig from "./router/index.jsx"

const { Content: AntdContent } = Layout;

function App() {
  return (
    <div className="App">
      <div className="left-sidebar">
        <Left />
      </div>
      <AntdContent className="content">
        <Content />
      </AntdContent>
      <div className="right-sidebar">
        <Right />
      </div>
    </div>
  )
}

export default App;