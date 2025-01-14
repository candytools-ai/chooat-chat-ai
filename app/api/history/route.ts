import { auth } from "@/app/(auth)/auth";
import { getChatsByUserId } from "@/db/queries";

export async function GET(request: Request) {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const app = searchParams.get("app") || "";

    if (!session || !session.user) {
        return Response.json("Unauthorized!", { status: 401 });
    }

    const chats = await getChatsByUserId({ id: session.user.id! });
    return Response.json(chats);
}
