import { auth } from "@/app/(auth)/auth";
import {  updateUserById } from "@/db/queries";

export async function POST(request: Request) {
  const { userData }: { userData: any } = await request.json();
  const session = await auth();

  if (!session || !session.user) {
    return Response.json("Unauthorized!", { status: 401 });
  }

  const userInfo = await updateUserById(session.user.id || "", userData);
  return Response.json({user: userInfo});
}
