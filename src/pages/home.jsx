import { Layout } from 'antd';
import UserChatBox from "../components/UserChatBox.jsx";
import Right from "../components/ComponentToolbox.jsx";
import CodeWorkspace from "../components/CodeWorkspace.jsx";
import Test from "../components/test.jsx";
import "../css/App.css";

const { Content: AntdContent } = Layout;

function Home() {
  return (
    <div className="App">
      <div className="left-sidebar">
        <UserChatBox />
      </div>
      <AntdContent className="content">
        <CodeWorkspace />
      </AntdContent>
      <div className="right-sidebar">
        <Right />
      </div>
    </div>
  )
}

export default Home;