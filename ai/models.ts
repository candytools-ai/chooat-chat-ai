// Define your models here.

export interface Model {
    id: string; // model id
    label: string; // model name
    path: string; // model path
    image: {
        light: string;
        dark: string;
    }
    apiIdentifier: string;
    fileAccept?: string[]
    formats?: string
}

export const models: Array<Model> = [
    {
        id: "gpt-4o",
        label: "GPT 4o",
        path: "gpt-4o",
        image: {
            light: "/models/gpt-icon.png",
            dark: "/models/gpt-icon.png",
        },
        apiIdentifier: "openai/gpt-4o",
        fileAccept: ["image/jpeg", "image/png", "image/webp"],
        formats: "PNG, JPG, WEBP, TXT",
    },
    {
        id: "gpt-4o-mini",
        label: "GPT 4o mini",
        path: "gpt-4o-mini",
        image: {
            light: "/models/gpt-icon.png",
            dark: "/models/gpt-icon.png",
        },
        apiIdentifier: "openai/gpt-4o-mini",
        fileAccept: ["image/jpeg", "image/png", "image/webp"],
        formats: "PNG, JPG, WEBP, TXT",
    },
    {
        id: "gemini-pro-1-5",
        label: "Gemini pro 1.5",
        path: "gemini-1-5-pro",
        image: {
            light: "/models/gemini-icon.webp",
            dark: "/models/gemini-icon.webp",
        },
        apiIdentifier: "gemini-1.5-pro",
        fileAccept: ["image/jpeg", "image/png", "image/webp", "application/pdf", "text/plain"],
        formats: "PDF, PNG, JPG, WEBP, TXT",
    },
] as const;

export const DEFAULT_MODEL_NAME: string = "gpt-4o";
