import request from "./request";
import { escapeRegExp } from "../utils/utils";  

export async function chatCompletion(messages, model = "gpt-4o") {
  try {
    const systemMessage = [
      {
        role: "system",
        content: [
          "You are a helpful assistant with expertise in UI/UX design.",
          "You're tasked with writing a visually appealing React component using JavaScript and custom CSS for a website.",
          "Only import React as a dependency.",
          "Be concise and only reply with the component code.",
          "You must follow these rules for adding custom data-* attributes:",
          "1. Add a 'data-rs' attribute to each major element with a unique, auto-incrementing number starting from 1.",
          "2. Include a 'data-type' attribute for every element describing its purpose or type.",
          "3. For elements with specific functionality, add a 'data-action' attribute indicating the action or purpose.",
          "4. Ensure all custom attributes are kebab-cased (lowercase with hyphens).",
          "5. Add comments explaining the purpose and value of each data-* attribute.",
          "6. Apply these attributes to all major elements (e.g., container divs, buttons, input fields, list items, headers).",
          "7. When rendering lists or repeated elements, ensure that the 'data-rs' remains unique for each instance.",
          "These custom attribute rules are mandatory and must be followed in all generated components.",
        ].join("\n"),
      },
      {
        role: "user",
        content: [
          `- Component Name: Section`,
          `- Do not use libraries or imports other than React.`,
          `- Use JavaScript, not TypeScript. Do not include any TypeScript syntax or type annotations.`,
          `- Adapt to mobile with a maximum width of 323px and a maximum height of 624px. Ensure that the container of the component does not have fixed width and height.`,
          `- Have any dynamic data. Use placeholders as data. Do not use props.`,
          `- Write only a single component. Do not include ReactDOM.render or any root rendering code.`,
          `- Use React hooks for state management and side effects.`,
          `- Focus on creating a visually appealing and aesthetically pleasing design.`,
          `- Use a harmonious color scheme and consider visual hierarchy in your layout.`,
          `- Incorporate smooth transitions or animations where appropriate to enhance user experience.`,
          `- Ensure the design is modern, clean, and user-friendly.`,
          `- Pay attention to spacing, alignment, and typography to create a polished look.`,
          `- Use custom CSS creatively to achieve an attractive design.`,
          `- Use px as the unit for all dimensions to ensure compatibility with different screen sizes.`,
          `- Include a <style> tag within the component to define the custom CSS styles.`,
          `- Include a <style> tag within the component to define the custom CSS styles. Use a root div with class name 'container'. Do not set a fixed height, but you can set a max-height.`,
          `- Ensure the CSS styles are scoped to the component to avoid affecting other parts of the application.`,
        ].join("\n"),
      },
    ];
    const enhancedMessages = [...systemMessage, ...messages];
    const response = await request({
      url: "/v1/chat/completions",
      method: "POST",
      data: {
        model,
        messages: enhancedMessages,
      },
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error in chatCompletion:", error);
    throw error;
  }
}

/**
 * reviseComponent 函数
 * 
 * 这个函数用于修改React组件代码。它通过OpenAI的API发送当前代码和修改提示，
 * 获取AI生成的代码差异，然后应用这些差异来更新组件代码。
 * 
 * @param {string} prompt - 描述如何修改组件的提示信息
 * @param {string} code - 当前的组件代码
 * @param {string} [model="gpt-4o"] - 使用的OpenAI模型，默认为"gpt-4o"
 * @returns {string} 返回修改后的组件代码
 * @throws {Error} 如果API返回无效结果、没有找到有效的代码差异，或发生其他错误
 */
export async function reviseComponent(prompt, code, model = "gpt-4o") {
  try {
    const systemMessage = [
      {
        role: "system",
        content: [
          "You are an AI programming assistant.",
          "Follow the user's requirements carefully & to the letter.",
          "You're working on a react component using javascript and css.",
          "Don't introduce any new components or files.",
          "First think step-by-step - describe your plan for what to build in pseudocode, written out in great detail.",
          "You must format every code change with an *edit block* like this:",
          "```",
          "<<<<<<< ORIGINAL",
          "    # some comment",
          "    # Func to multiply",
          "    def mul(a,b)",
          "=======",
          "    # updated comment",
          "    # Function to add",
          "    def add(a,b):",
          ">>>>>>> UPDATED",
          "```",
          "There can be multiple code changes.",
          "Modify as few characters as possible and use as few characters as possible on the diff.",
          "Minimize any other prose.",
          "Keep your answers short and impersonal.",
          "Never create a new component or file.",
          `Always give answers by modifying the following code:\n\`\`\`tsx\n${code}\n\`\`\``,
        ].join("\n"),
      },
      {
        role: "user",
        content: `${prompt}`,
      },
    ];
    const enhancedMessages = [...systemMessage];
    const response = await request({
      url: "/v1/chat/completions",
      method: "POST",
      data: {
        model,
        messages: enhancedMessages,
        temperature: 0,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 2000,
        n: 1,
      },
    });
    const choices = response.choices;

    if (
      !choices ||
      choices.length === 0 ||
      !choices[0] ||
      !choices[0].message ||
      !choices[0].message.content
    ) {
      throw new Error("OpenAI API 未返回有效选项");
    }

    const diff = choices[0].message.content;

    if (!containsDiff(diff)) {
      throw new Error("消息中未找到有效的代码差异");
    }

    const newCode = applyDiff(code, diff);

    return newCode;
  } catch (error) {
    console.error("reviseComponent 函数出错:", error);
    throw error; // 重新抛出错误，允许调用者处理
  }
}

const containsDiff = (message) => {
  return (
    message.includes("<<<<<<< ORIGINAL") &&
    message.includes(">>>>>>> UPDATED") &&
    message.includes("=======\n")
  );
};

const applyDiff = (code, diff) => {
  const regex = /<<<<<<< ORIGINAL\n(.*?)=======\n(.*?)>>>>>>> UPDATED/gs;

  let match;

  while ((match = regex.exec(diff)) !== null) {
    const [, before, after] = match;

    let regex = escapeRegExp(before);
    regex = regex.replaceAll(/\r?\n/g, "\\s+");
    regex = regex.replaceAll(/\t/g, "");

    const replaceRegex = new RegExp(regex);

    code = code.replace(replaceRegex, after);
  }

  return code;
};

