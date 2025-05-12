import { InferenceClient } from "@huggingface/inference";

export const inference = new InferenceClient(process.env.HF_API_KEY)
