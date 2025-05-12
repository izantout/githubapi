import { NextResponse } from "next/server";
import { inference } from "@/utils/hf";
import { fs } from "fs/promises";
import { path } from "path";
import { parse } from "url";

export async function POST(request) {
  const { query } = parse(request.url, true);
  const type = query.type;

  const formData = await request.formData();

  try {
    if (type === "compare") {
      try {
        const user1Raw = formData.get("user1");
        const user2Raw = formData.get("user2");
        const prompt = formData.get("prompt");

        if (!user1Raw || !user2Raw || !prompt) {
          throw new Error("Missing user1, user2, or prompt.");
        }

        const record1 = JSON.parse(user1Raw);
        const record2 = JSON.parse(user2Raw);

        const combined = `
Compare the following two users based on this prompt:
"${prompt}"

User 1:
${JSON.stringify(record1, null, 2)}

User 2:
${JSON.stringify(record2, null, 2)}
`;

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

    if (type == "comp") {
      let message = formData.get("message");

      const out = await inference.chatCompletion({
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 1000,
      });

      console.log(out.choices[0].message);
      return NextResponse.json(
        { message: out.choices[0].message },
        { status: 200 }
      );
    }

    if (type == "translation") {
      const text = formData.get("Text");
      const out = await inference.translation({
        model: "t5-base",
        inputs: text,
      });

      console.log(out);
      return NextResponse.json({ message: out }, { status: 200 });
    }

    if (type == "imgtt") {
      const imageBlob = formData.get("image");

      if (!imageBlob) {
        throw new Error("No image file found in this request");
      }

      const out = await inference.imageToText({
        data: imageBlob,
        model: "nlpconnect/vit-gpt2-image-captioning",
      });

      console.log(out);
      return NextResponse.json({ message: out }, { status: 200 });
    }

    if (type == "ttimg") {
      const prompt = formData.get("prompt");
      const out = await inference.texToImage({
        model: "nlpconnect/vit-gpt2-image-captioning",
        inputs: prompt,
        parameters: {
          negative_prompt: "blurry",
        },
      });

      console.log(out);
      const buffer = Buffer.from(await out.arrayBuffer());
      const imagePath = path.join(
        process.cwd(),
        "public",
        "image",
        "generated-image.jpg"
      );

      await fs.writeFile(imagePath, buffer);

      const baseUrl = "https://localhost:3000";
      const imageUrl = `${baseUrl}/images/generated-image.jpg`;

      return NextResponse.json({ message: imageUrl }, { status: 200 });
    }
  } catch (error) {
    console.error("Compare block failed:", error);
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
