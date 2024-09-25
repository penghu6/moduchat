import { configureStore } from "@reduxjs/toolkit";
import chatAiReducer from "./chat-ai-slice";
import appPreviewReducer from "./app-preview-slice";

// 配置 Redux store，包含 chatAi 和 appPreview 两个 slice 的 reducer
export default configureStore({
  reducer: {
    chatAi: chatAiReducer,
    appPreview: appPreviewReducer,
  },
});
