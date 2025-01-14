
import { models } from "@/ai/models";
import { generateUUID } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Chat } from "@/components/chat/chat-ui";
import { DataStreamHandler } from '@/components/data-stream-handler';

export async function generateMetadata({ params }: any) {
    const { locale, model: modelPath } = await params;
    const currentModel = models.find((model) => model.path === modelPath) || models[0];
    const t = await getTranslations(currentModel.id);

    return {
        title: t("Metadata.title"),
        description: t("Metadata.description"),
    };
}

export default async function Page(props: { params: Promise<any> }) {
    const params = await props.params;
    const { model: modelPath } = params;
    const id = generateUUID();

    const selectedModelId =
        models.find((model) => model.path === modelPath)?.id

    if (!selectedModelId) {
        notFound();
    }

    return (
        <>
            <Chat
                key={id}
                id={id}
                initialMessages={[]}
                selectedModelId={selectedModelId}
            />
            <DataStreamHandler id={id} />
        </>
    );
}
