import { createSlice } from '@reduxjs/toolkit';

const contentSlice = createSlice({
  name: 'content',
  initialState: {
    isSmartEditMode: false,
  },
  reducers: {
    toggleSmartEditMode: (state) => {
      state.isSmartEditMode = !state.isSmartEditMode;
    },
  },
});

export const { toggleSmartEditMode } = contentSlice.actions;
export default contentSlice.reducer;
