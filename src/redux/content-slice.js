import { createSlice } from '@reduxjs/toolkit';

const contentSlice = createSlice({
  name: 'content',
  initialState: {
    isSmartEditMode: false,
    code: '', // 新增的代码状态
  },
  reducers: {
    toggleSmartEditMode: (state) => {
      state.isSmartEditMode = !state.isSmartEditMode;
    },
    setCode: (state, action) => { // 新增的 action
      state.code = action.payload;
    },
  },
});

export const { toggleSmartEditMode, setCode } = contentSlice.actions;
export default contentSlice.reducer;
