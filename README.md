# moduchat
l联系项目

## 运行命令

确保你已经安装了 Node.js 和 npm。然后，按照以下步骤操作：

1. 安装依赖：
   ```bash
   npm install
   ```

2. 开发模式运行：
   ```bash
   npm start
   ```
   这将启动开发服务器，通常在 http://localhost:3000打开。

3. 构建生产版本：
   ```bash
   npm run build
   ```
   这将在 `dist` 目录下生成生产版本的文件。

## 注意事项

- 确保你的 `package.json` 文件中包含了相应的脚本。
- 如果遇到任何问题，请检查 `webpack.config.js` 文件的配置是否正确。
- 构建后的文件可以直接在浏览器中打开 `dist/index.html` 查看。
