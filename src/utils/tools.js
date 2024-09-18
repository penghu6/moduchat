/**
 * 将 JSON 数据存储到本地存储
 * @param {string} key - 存储的键名
 * @param {any} value - 要存储的值（将被转换为 JSON）
 */
export const setItem = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * 从本地存储中检索 JSON 数据
 * @param {string} key - 要检索的键名
 * @param {any} defaultValue - 如果键不存在时返回的默认值
 * @returns {any} 解析后的值，如果解析失败则返回默认值
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * 从本地存储中移除指定的项
 * @param {string} key - 要移除的键名
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing item from localStorage:', error);
  }
};

/**
 * 清除所有本地存储的数据
 */
export const clear = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * 获取本地存储中的所有键
 * @returns {string[]} 键名数组
 */
export const getAllKeys = () => {
  try {
    return Object.keys(localStorage);
  } catch (error) {
    console.error('Error getting keys from localStorage:', error);
    return [];
  }
};
