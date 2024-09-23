import { Layout } from 'antd';
import Left from "./components/Left.jsx";
import Right from "./components/Right.jsx";
import Content from "./components/Content.jsx";
import Test from "./components/Test.jsx";
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
        <Test />
      </div>
    </div>
  )
}

export default App;