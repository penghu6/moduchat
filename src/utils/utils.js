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

  export const extractCodeBlocks = (content) => {
    const blocks = {
        js: ''
    };

    const regex = /```(jsx?|react|javascript)\n([\s\S]*?)```/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
        const code = match[2].trim();
        blocks.js += code + '\n\n';
    }
    console.log("Extracted blocks:", blocks);
    return blocks;
};
  