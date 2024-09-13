import { configureStore } from "@reduxjs/toolkit";
import chatAiReducer from "./chatAiSlice";

export default configureStore({
  reducer: {
    chatAi: chatAiReducer,
  },
});
