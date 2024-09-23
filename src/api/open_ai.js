import request from "./request";

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
        ].join("\n"),
      },
      {
        role: "user",
        content: [
          `- Component Name: Section`,
          `- Component Description: ${prompt}\n`,
          `- Do not use libraries or imports other than React.`,
          `- Use JavaScript, not TypeScript. Do not include any TypeScript syntax or type annotations.`,
          `- Adapt to mobile with width: '323px', height: '624px'. The view window is 750rpx.`,
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

