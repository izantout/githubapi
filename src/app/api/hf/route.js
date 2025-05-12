import { NextResponse } from "next/server";
import { inference } from "@/utils/hf";
import { parse } from "url";

/**
 * Handles POST requests to perform inference tasks based on the `type` parameter.
 * Supports user comparison
 *
 * @param {Request} request - The incoming Next.js API request object.
 * @returns {Promise<NextResponse>} - A JSON response with the processed result or an error.
 */

export async function POST(request) {
  const { query } = parse(request.url, true);
  const type = query.type;

  const formData = await request.formData();

  try {
    if (type === "compare") {
      try {

        // Get user data + prompt
        const user1Raw = formData.get("user1");
        const user2Raw = formData.get("user2");
        const prompt = formData.get("prompt");

        // Get error handling
        if (!user1Raw || !user2Raw || !prompt) {
          throw new Error("Missing user1, user2, or prompt.");
        }

        // Turn json to map
        const user1 = JSON.parse(user1Raw);
        const user2 = JSON.parse(user2Raw);

        // Turn data into 1 string
        const combined = `Compare the following two users based on this prompt:"${prompt}" User 1:${JSON.stringify(
          user1,
          null,
          2
        )} User 2:${JSON.stringify(user2, null, 2)}`;

        // Model name + message
        const out = await inference.chatCompletion({
          model: "HuggingFaceH4/zephyr-7b-beta",
          messages: [{ role: "user", content: combined }],
          max_tokens: 1000,
        });

        console.log("HF response:", out);
        return NextResponse.json({
          message: out.choices?.[0]?.message?.content || "No response",
        });
      } catch (error) {
        console.error("Compare block failed:", error);
        return NextResponse.json(
          { error: error.message, stack: error.stack },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    // General error handling
    console.error("Compare block failed:", error);
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
