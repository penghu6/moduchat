import { createSlice } from '@reduxjs/toolkit';

const appPreviewSlice = createSlice({
  name: 'appPreview',
  initialState: {
    components: []
  },
  reducers: {
    addComponent: (state, action) => {
      state.components.push(action.payload);
    },
    clearComponents: (state) => {
      state.components = [];
    },
    removeComponent: (state, action) => {
      state.components = state.components.filter((_, index) => index !== action.payload);
    }
  }
});

export const { addComponent, clearComponents, removeComponent } = appPreviewSlice.actions;
export default appPreviewSlice.reducer;
