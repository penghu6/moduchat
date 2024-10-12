import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatCompletion } from '../api/open_ai';

// 定义一个异步 thunk，用于发送消息并获取 AI 的回复
export const sendMessage = createAsyncThunk(
  'chat/sendMessage', // 更新 slice 名称
  async ({ text, image }, { getState }) => {
    const { messages } = getState().chat; // 确保这里使用的是 'chat'
    const response = await chatCompletion([...messages, { role: 'user', content: text }], image);
    return response;
  }
);

// 创建一个 Redux slice，用于管理聊天 AI 的状态
const chatSlice = createSlice({
  name: 'chat', // 更新 slice 名称
  initialState: {
    messages: [], // 初始状态，包含一个空的消息数组
    isLoading: false, // 是否正在加载
    error: null, // 错误信息
    codeComponent: { html: '', css: '', js: '' }, // 新增 codeBlocks 状态
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
    updateCodeHandle: (state, action) => { // 新增更新 codeBlocks 的 reducer
      state.codeComponent = action.payload;
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

// 导出新的 action
export const { addMessage, clearMessages, updateCodeHandle } = chatSlice.actions;
export default chatSlice.reducer;
