import { backendService } from './request';

// 创建用户组件
export async function createUserComponent(data) {
  try {
    const response = await backendService.post('/user-component/create', data);
    return response;
  } catch (error) {
    console.error('创建用户组件出错：', error);
    throw error;
  }
}

// 更新用户组件
export async function updateUserComponent(data) {
  try {
    const response = await backendService.post('/user-component/update', data);
    return response;
  } catch (error) {
    console.error('更新用户组件出错：', error);
    throw error;
  }
}

// 删除用户组件
export async function deleteUserComponent(id) {
  try {
    const response = await backendService.post('/user-component/delete', { id });
    return response;
  } catch (error) {
    console.error('删除用户组件出错：', error);
    throw error;
  }
}

// 获取用户组件列表
export async function listUserComponents(params) {
  try {
    const response = await backendService.get('/user-component/list', { params });
    return response;
  } catch (error) {
    console.error('获取用户组件列表出错：', error);
    throw error;
  }
}

// 获取单个用户组件信息
export async function getUserComponentInfo(id) {
  try {
    const response = await backendService.get('/user-component/info', { params: { id } });
    return response;
  } catch (error) {
    console.error('获取用户组件信息出错：', error);
    throw error;
  }
}

