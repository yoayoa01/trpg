import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import argon2 from "argon2";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
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

    if (!user.passwordHash) {
      return NextResponse.json(
        { error: "SNS連携のためパスワードは変更できません。" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "必要な項目が不足しています。" },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: "現在のパスワードと新しいパスワードが同じです。" },
        { status: 400 }
      );
    }

    const isMatch = await argon2.verify(user.passwordHash, currentPassword);

    if (!isMatch) {
      return NextResponse.json(
        { error: "現在のパスワードが正しくありません。" },
        { status: 400 }
      );
    }

    const newPasswordHash = await argon2.hash(newPassword);

    await prisma.user.update({
      where: {
        userId: session.user.name,
      },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("change-password error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}