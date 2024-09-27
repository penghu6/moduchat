export const escapeRegExp = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  };
  export const preprocessCode = (code) => {
    let processedCode = code
      .replace(/import\s+.*?from\s+['"].*?['"];?/g, '') // 去掉所有 import 语句
      .replace(/export\s+default\s+\w+;?/, '') // 去掉 export default 语句
      .replace(/const\s+\{\s*useState\s*,\s*useEffect\s*\}\s*=\s*React\s*;?/g, '') // 去掉 const { useState, useEffect } = React;
      .replace(/const\s+\{\s*useState\s*\}\s*=\s*React\s*;?/g, '') // 去掉 const { useState } = React;
      .replace(/import\s+React,\s*{\s*useState\s*}\s*from\s+['"]react['"];?/g, ''); // 去掉 import React, { useState } from 'react';
      return processedCode;
  };
  