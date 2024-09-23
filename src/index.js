import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import 'antd/dist/reset.css';
import zhCN from "antd/es/locale/zh_CN"; // 中文语言包
import { ConfigProvider } from "antd";
import store from "./redux/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import '@babel/standalone';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
  <BrowserRouter>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </BrowserRouter>
  </Provider>
  
);
