import { NextResponse } from "next/server";
import argon2 from "argon2";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, password } = await req.json();

    if (!userId || !password) {
      return NextResponse.json(
        { error: "必要な項目が不足しています。" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { userId },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "このユーザーIDは既に使われています。" },
        { status: 400 }
      );
    }

    const passwordHash = await argon2.hash(password);

    await prisma.user.create({
      data: {
        userId,
        passwordHash,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("register error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}