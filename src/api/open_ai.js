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

