import { configureStore } from "@reduxjs/toolkit";
import chatAiReducer from "./chatAiSlice";
import appPreviewReducer from "./appPreviewSlice";

export default configureStore({
  reducer: {
    chatAi: chatAiReducer,
    appPreview: appPreviewReducer,
  },
});
