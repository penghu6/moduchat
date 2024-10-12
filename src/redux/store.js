import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice";
import appPreviewReducer from "./app-preview-slice";
import contentReducer from "./content-slice";  // 导入新的 content-slice

// 配置 Redux store，包含 chatAi、appPreview 和 content 三个 slice 的 reducer
export default configureStore({
  reducer: {
    chat: chatReducer,
    appPreview: appPreviewReducer,
    content: contentReducer,  // 添加 content reducer
  },
});
