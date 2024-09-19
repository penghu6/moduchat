import request from "./request";

export async function chatCompletion(messages, model = "gpt-4o") {
  try {
    const response = await request({
      url: "/v1/chat/completions",
      method: "POST",
      data: {
        model,
        messages,
      },
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error in chatCompletion:", error);
    throw error;
  }
}