import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatCompletion } from '../api/open_ai';

export const sendMessage = createAsyncThunk(
  'chatAi/sendMessage',
  async (message, { getState }) => {
    const { messages } = getState().chatAi;
    const response = await chatCompletion([...messages, { role: 'user', content: message }]);
    return response;
  }
);

const chatAiSlice = createSlice({
  name: 'chatAi',
  initialState: {
    messages: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push({
          role: 'assistant',
          content: action.payload,
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { addMessage, clearMessages } = chatAiSlice.actions;
export default chatAiSlice.reducer;
