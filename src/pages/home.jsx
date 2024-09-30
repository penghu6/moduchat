import { Layout } from 'antd';
import Left from "../components/left.jsx";
import Right from "../components/right.jsx";
import Content from "../components/content.jsx";
import Test from "../components/test.jsx";
import "../css/App.css";

const { Content: AntdContent } = Layout;

function Home() {
  return (
    <div className="App">
      <div className="left-sidebar">
        <Left />
      </div>
      <AntdContent className="content">
        <Test />
      </AntdContent>
      <div className="right-sidebar">
        <Right />
      </div>
    </div>
  )
}

export default Home;