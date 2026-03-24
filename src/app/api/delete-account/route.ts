import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.name) {
      return NextResponse.json(
        { error: "ログインが必要です。" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        userId: session.user.name,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません。" },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: {
        userId: session.user.name,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("delete-account error:", error);
    return NextResponse.json(
      { error: "アカウント削除に失敗しました。" },
      { status: 500 }
    );
  }
}