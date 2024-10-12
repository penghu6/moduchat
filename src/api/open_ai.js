import request from "./request";
import { escapeRegExp } from "../utils/utils";  

export async function chatCompletion(messages, imageFile = null) {
  try {
    const model = "gpt-4-vision-preview";
    const systemMessage = [
      {
        role: "system",
        content: [
          "You're tasked with writing a visually appealing React component using JavaScript and TailwindCSS for a website.",
          "Only import React as a dependency.",
          "Use stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.",
          "Be concise and only reply with the component code.",
          "Priority use of example images https://picsum.photos/ Width/height? Random=random number",
          "You must follow these rules for adding custom data-* attributes:",
          "1. Add a 'data-rs' attribute to each major element with a unique, auto-incrementing number starting from 1.",
          "4. Ensure all custom attributes are kebab-cased (lowercase with hyphens).",
          "6. Apply these attributes to all major elements (e.g., container divs, buttons, input fields, list items, headers).",
          "7. When rendering lists or repeated elements, ensure that the 'data-rs' remains unique for each instance.",
          "These custom attribute rules are mandatory and must be followed in all generated components.",
          "Be concise and only reply with code.",
          "Don't use loops to generate dynamic data",
          
        ].join("\n"),
      },
      {
        role: "user",
        content: [
          `- By default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.`,
          `-For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.`,
          `- Do not use libraries or imports other than React.`,
          `- Use JavaScript, not TypeScript. Do not include any TypeScript syntax or type annotations.`,
          `- Adapt to mobile with a maximum width of 323px and a maximum height of 624px. Ensure that the container of the component does not have fixed width and height.`,
          `- Don't use loops to generate dynamic data`,
          `- Write only a single component. Do not include ReactDOM.render or any root rendering code.`,
          `- Use React hooks for state management and side effects.`,
          `- Focus on creating a visually appealing and aesthetically pleasing design.`,
          `- Use a harmonious color scheme and consider visual hierarchy in your layout.`,
          `- Incorporate smooth transitions or animations where appropriate to enhance user experience.`,
          `- Ensure the design is modern, clean, and user-friendly.`,
          `- Pay attention to spacing, alignment, and typography to create a polished look.`,
          `- Use TailwindCSS creatively to achieve an attractive design.`,
          `- Do not have any dynamic data. Use placeholders as data. Do not use props.`,
          `- Write only a single component.`,
          
        ].join("\n"),
      },
    ];

    if (imageFile) {
      const base64Image = await convertImageToBase64(imageFile);
      systemMessage.push({
        role: 'user',
        content: [
          { type: "text", text: messages.map(msg => msg.content).join(' ') },
          { type: "image_url", image_url: { "url": `data:image/jpeg;base64,${base64Image}` } }
        ]
      });
    } else {
      systemMessage.push(...messages);
    }

    const response = await request({
      url: "/v1/chat/completions",
      method: "POST",
      data: {
        model,
        messages: systemMessage,
        max_tokens: 4096,
      },
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error in chatCompletion:", error);
    throw error;
  }
}

// 辅助函数：将图片文件转换为 base64 编码
function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
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
          "You're working on a react component using javascript and TailwindCSS.",
          "Don't introduce any new components or files.",
          "Style modifications exist, use in-line styles.",
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
