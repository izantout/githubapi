import { InferenceClient } from "@huggingface/inference";

// Export HuggingFace inference client
export const inference = new InferenceClient(process.env.HF_API_KEY)
