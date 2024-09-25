import { createSlice } from '@reduxjs/toolkit';

// 创建一个 Redux slice，用于管理应用预览组件的状态
const appPreviewSlice = createSlice({
  name: 'appPreview', // slice 的名称
  initialState: {
    components: [] // 初始状态，包含一个空的组件数组
  },
  reducers: {
    // 添加组件的 reducer
    addComponent: (state, action) => {
      state.components.push(action.payload);
    },
    // 清空组件的 reducer
    clearComponents: (state) => {
      state.components = [];
    },
    // 移除组件的 reducer，根据索引移除
    removeComponent: (state, action) => {
      state.components = state.components.filter((_, index) => index !== action.payload);
    }
  }
});

// 导出 actions 和 reducer
export const { addComponent, clearComponents, removeComponent } = appPreviewSlice.actions;
export default appPreviewSlice.reducer;
