"server-only";

import { genSaltSync, hashSync } from "bcrypt-ts";
import { and, asc, count, desc, eq, gt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import {
    user,
    chat,
    User,
    Message,
    message,
    vote,
} from "./schema";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
export let db = drizzle(client);

export async function getUser(email: string): Promise<Array<User>> {
    try {
        const userData = await db
            .select()
            .from(user)
            .where(eq(user.email, email));

        return userData;
    } catch (error) {
        console.error(error);
        console.error("Failed to get user from database");
        throw error;
    }
}

export async function getUserById(userId: string) {
    try {
        const userData = await db
            .select()
            .from(user)
            .where(eq(user.id, userId));

        return userData;
    } catch (error) {
        console.error(error);
        console.error("Failed to get user info from database");
        throw error;
    }
}

export async function createUser(
    email: string,
    password: string,
    username: string
) {
    let salt = genSaltSync(10);
    let hash = hashSync(password, salt);

    try {
        return await db
            .insert(user)
            .values({ email, password: hash, name: username });
    } catch (error) {
        console.error("Failed to create user in database");
        throw error;
    }
}

export async function saveChat({
    id,
    userId,
    title,
    model,
}: {
    id: string;
    userId: string;
    title?: string;
    model: string;
}) {
    try {
        return await db.insert(chat).values({
            id,
            createdAt: new Date(),
            userId,
            title: title || "",
            model,
        });
    } catch (error) {
        console.error("Failed to save chat in database");
        throw error;
    }
}

export async function deleteChatById({ id }: { id: string }) {
    try {
        await db.delete(vote).where(eq(vote.chatId, id));
        await db.delete(message).where(eq(message.chatId, id));

        return await db.delete(chat).where(eq(chat.id, id));
    } catch (error) {
        console.error("Failed to delete chat by id from database");
        throw error;
    }
}

export async function getChatsByUserId({ id }: { id: string }) {
    try {
        return await db
            .select()
            .from(chat)
            .where(eq(chat.userId, id))
            .orderBy(desc(chat.createdAt));
    } catch (error) {
        console.error("Failed to get chats by user from database");
        throw error;
    }
}

export async function getChatById({ id }: { id: string }) {
    try {
        const [selectedChat] = await db
            .select()
            .from(chat)
            .where(eq(chat.id, id));
        return selectedChat;
    } catch (error) {
        console.error("Failed to get chat by id from database");
        throw error;
    }
}

export async function saveMessages({ messages }: { messages: Array<Message> }) {
    try {
        return await db.insert(message).values(messages);
    } catch (error) {
        console.error("Failed to save messages in database", error);
        throw error;
    }
}

export async function getMessagesByChatId({ id }: { id: string }) {
    try {
        return await db
            .select()
            .from(message)
            .where(eq(message.chatId, id))
            .orderBy(asc(message.createdAt));
    } catch (error) {
        console.error("Failed to get messages by chat id from database", error);
        throw error;
    }
}

export async function voteMessage({
    chatId,
    messageId,
    type,
}: {
    chatId: string;
    messageId: string;
    type: "up" | "down";
}) {
    try {
        const [existingVote] = await db
            .select()
            .from(vote)
            .where(and(eq(vote.messageId, messageId)));

        if (existingVote) {
            return await db
                .update(vote)
                .set({ isUpvoted: type === "up" ? true : false })
                .where(
                    and(eq(vote.messageId, messageId), eq(vote.chatId, chatId))
                );
        } else {
            return await db.insert(vote).values({
                chatId,
                messageId,
                isUpvoted: type === "up" ? true : false,
            });
        }
    } catch (error) {
        console.error("Failed to upvote message in database", error);
        throw error;
    }
}

export async function getVotesByChatId({ id }: { id: string }) {
    try {
        return await db.select().from(vote).where(eq(vote.chatId, id));
    } catch (error) {
        console.error("Failed to get votes by chat id from database", error);
        throw error;
    }
}

export async function updateUserById(id: string, userData: any) {
    try {
        return await db.update(user).set(userData).where(eq(user.id, id));
    } catch (error) {
        console.error("Failed to update user info in database", error);
        throw error;
    }
}