import { getModelById } from "./utils";
import { DEFAULT_MODEL_NAME, models } from "@/ai/models";

export const navigation = [
    { title: "Home", href: "/" },
    { title: "AI Chat", href: `/chat/${getModelById(DEFAULT_MODEL_NAME).path}` },
];
