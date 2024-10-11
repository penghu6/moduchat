import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatCompletion } from '../api/open_ai';

// 定义一个异步 thunk，用于发送消息并获取 AI 的回复
export const sendMessage = createAsyncThunk(
  'chatAi/sendMessage',
  async ({ text, image }, { getState }) => {
    const { messages } = getState().chatAi;
    const response = await chatCompletion([...messages, { role: 'user', content: text }], image);
    return response;
  }
);

// 创建一个 Redux slice，用于管理聊天 AI 的状态
const chatAiSlice = createSlice({
  name: 'chatAi', // slice 的名称
  initialState: {
    messages: [], // 初始状态，包含一个空的消息数组
    isLoading: false, // 是否正在加载
    error: null, // 错误信息
  },
  reducers: {
    // 添加消息的 reducer
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    // 清空消息的 reducer
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true; // 发送消息时设置加载状态为 true
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false; // 消息发送成功后设置加载状态为 false
        state.messages.push({
          role: 'assistant',
          content: action.payload,
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false; // 消息发送失败后设置加载状态为 false
        state.error = action.error.message; // 设置错误信息
      });
  },
});

// 导出 actions 和 reducer
export const { addMessage, clearMessages } = chatAiSlice.actions;
export default chatAiSlice.reducer;
