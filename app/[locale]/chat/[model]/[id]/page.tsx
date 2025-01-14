import { notFound } from "next/navigation";
import { models } from "@/ai/models";
import { getChatById, getMessagesByChatId } from "@/db/queries";
import { convertToUIMessages } from "@/lib/utils";
import { Chat } from "@/components/chat/chat-ui";
import { DataStreamHandler } from "@/components/data-stream-handler";

export default async function Page(props: { params: Promise<any> }) {
    const params = await props.params;
    const { id, model: modelPath } = params;
    const chat = await getChatById({ id }).catch((err) => notFound());

    const selectedModelId = models.find(
        (model) => model.path === modelPath
    )?.id;

    if (!selectedModelId) {
        notFound();
    }

    const messagesFromDb = await getMessagesByChatId({
        id,
    });

    return (
        <>
            <Chat
                id={id}
                initialMessages={convertToUIMessages(messagesFromDb)}
                selectedModelId={selectedModelId}
            />
            <DataStreamHandler id={id} />
        </>
    );
}
