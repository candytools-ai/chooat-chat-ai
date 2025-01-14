import { InferSelectModel } from "drizzle-orm";
import {
    pgTable,
    pgSchema,
    varchar,
    timestamp,
    json,
    uuid,
    text,
    primaryKey,
    foreignKey,
    boolean,
    integer,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const mySchema = pgSchema("chooat");

export const user = mySchema.table("user", {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    name: varchar("name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: varchar("image", { length: 1024 }),
    password: varchar("password", { length: 256 }),
    credits: integer().notNull().default(10), // 标准积分
    advanced: integer().notNull().default(0), // 高级积分
    subscribed: boolean("subscribed").notNull().default(false),
    paid: boolean("paid").notNull().default(false),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp({ mode: "date", precision: 3 }).$onUpdate(
        () => new Date()
    ),
});

export const accounts = mySchema.table(
    "account",
    {
        userId: uuid("userId")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        type: varchar("type", { length: 256 })
            .$type<AdapterAccountType>()
            .notNull(),
        provider: varchar("provider").notNull(),
        providerAccountId: varchar("providerAccountId", {
            length: 256,
        }).notNull(),
        refresh_token: varchar("refresh_token"),
        access_token: varchar("access_token"),
        expires_at: integer("expires_at"),
        token_type: varchar("token_type"),
        scope: varchar("scope"),
        id_token: varchar("id_token"),
        session_state: varchar("session_state", { length: 1024 }),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
);

export const sessions = mySchema.table("session", {
    sessionToken: varchar("sessionToken", { length: 256 }).primaryKey(),
    userId: uuid("userId")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = mySchema.table(
    "verificationToken",
    {
        identifier: varchar("identifier", { length: 256 }).notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => ({
        compositePk: primaryKey({
            columns: [verificationToken.identifier, verificationToken.token],
        }),
    })
);

export const authenticators = mySchema.table(
    "authenticator",
    {
        credentialID: varchar("credentialID", { length: 256 }).notNull().unique(),
        userId: uuid("userId")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        providerAccountId: varchar("providerAccountId", { length: 256 }).notNull(),
        credentialPublicKey: varchar("credentialPublicKey", { length: 256 }).notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: varchar("credentialDeviceType", { length: 256 }).notNull(),
        credentialBackedUp: boolean("credentialBackedUp").notNull(),
        transports: varchar("transports", { length: 256 }),
    },
    (authenticator) => ({
        compositePK: primaryKey({
            columns: [authenticator.userId, authenticator.credentialID],
        }),
    })
);

export type User = InferSelectModel<typeof user>;

export const chat = mySchema.table("Chat", {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    title: text("title"),//.notNull(),
    model: varchar("model").default("chooat"),
    userId: uuid("userId")
        .notNull()
        .references(() => user.id),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = mySchema.table("Message", {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    chatId: uuid("chatId")
        .notNull()
        .references(() => chat.id),
    role: varchar("role").notNull(),
    content: json("content").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    // model: varchar("model"),
});

export type Message = InferSelectModel<typeof message>;

export const vote = mySchema.table(
    "Vote",
    {
        chatId: uuid("chatId")
            .notNull()
            .references(() => chat.id),
        messageId: uuid("messageId")
            .notNull()
            .references(() => message.id),
        isUpvoted: boolean("isUpvoted").notNull(),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.chatId, table.messageId] }),
        };
    }
);

export type Vote = InferSelectModel<typeof vote>;

export const file = mySchema.table("File", {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    messageId: uuid("messageId")
        .notNull()
        .references(() => message.id),
    url: varchar("url").default("").notNull(),
    pathname: varchar("pathname").default("").notNull(),
    contentType: varchar("contentType").default("").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type File = InferSelectModel<typeof file>;
