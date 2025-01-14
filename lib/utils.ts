import { Message } from "ai";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { Message as DBMessage } from "@/db/schema";
import { DEFAULT_MODEL_NAME, Model, models } from "@/ai/models";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ApplicationError extends Error {
    info: string;
    status: number;
}

export const fetcher = async (url: string) => {
    const res = await fetch(url);

    if (!res.ok) {
        const error = new Error(
            "An error occurred while fetching the data."
        ) as ApplicationError;

        error.info = await res.json();
        error.status = res.status;

        throw error;
    }

    return res.json();
};

export function getLocalStorage(key: string) {
    if (typeof window !== "undefined") {
        return JSON.parse(localStorage.getItem(key) || "[]");
    }
    return [];
}

export function validateEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

export function generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}

export function formatDate(input: Date | string | number): string {
    const date = new Date(input);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function convertToUIMessages(
    messages: Array<DBMessage>
): Array<Message> {
    return messages.reduce((chatMessages: Array<Message>, message) => {
        let textContent = "";
        let experimental_attachments: Array<any> = [];

        if (typeof message.content === "string") {
            textContent = message.content;
        } else if (Array.isArray(message.content)) {
            for (const content of message.content) {
                if (content.type === "text") {
                    textContent += content.text;
                } else if (content.url) {
                    experimental_attachments.push({
                        name: content.name,
                        url: content.url,
                        contentType: content.type,
                        size: content.size,
                    });
                }
            }
        }

        chatMessages.push({
            id: message.id,
            role: message.role as Message["role"],
            content: textContent,
            experimental_attachments,
        });

        return chatMessages;
    }, []);
}

export function sanitizeUIMessages(messages: Array<Message>): Array<Message> {
    const messagesBySanitizedToolInvocations = messages.map((message) => {
        if (message.role !== "assistant") return message;

        return {
            ...message,
        };
    });

    return messagesBySanitizedToolInvocations.filter(
        (message) => message.content.length > 0
    );
}

export function getMessageIdFromAnnotations(message: Message) {
    if (!message.annotations) return message.id;

    const [annotation] = message.annotations;
    if (!annotation) return message.id;

    // @ts-expect-error messageIdFromServer is not defined in MessageAnnotation
    return annotation.messageIdFromServer;
}

export function getModelById(modelId: string): Model {
    if (!modelId) return models[0];
    const model = models.find((model) => model.id === modelId);
    return model || models[0];
}

export function getModelByPathname(pathname: string): Model {
    if (pathname.substring(0, 1) !== "/") pathname = "/" + pathname;
    const paths = pathname.split("/");
    if (paths.length < 3) return models[0];
    const model = models.find((model) => model.path === paths[2]);
    return model || models[0];
}

export function getModelIdByPathname(pathname: string) {
    if (pathname.substring(0, 1) !== "/") pathname = "/" + pathname;
    const paths = pathname.split("/");
    if (paths.length < 3) return DEFAULT_MODEL_NAME;
    const model = models.find((model) => model.path === paths[2]);
    return model?.id || DEFAULT_MODEL_NAME;
}

export function getPathnameByURL(url: string) {
    try {
        const paths = url.split("/");
        return paths.pop();
    } catch (error) {
        return "unknow";
    }
}

export function formatBytes(bytes: number, decimals?: number) {
    if (bytes == 0) return "0 Bytes";
    const k = 1024,
        dm = decimals || 2,
        sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function convertNumber(num: number) {
    const base = Math.floor(num / 10) * 10;
    return `${base}+`;
}

export function convertToAscii(inputString: string) {
    // remove non ascii characters
    const asciiString = inputString.replace(/[^\x00-\x7F]+/g, "");
    return asciiString;
}
