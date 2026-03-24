"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MyPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f4ff 0%, #fafafa 50%, #f5f0ff 100%)",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* ヘッダー */}
      <header style={{
        padding: "16px 32px",
        borderBottom: "1px solid #e5e7eb",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{ fontSize: "22px", fontWeight: 800, color: "#1e293b", letterSpacing: "-0.5px" }}>
          TRPG通過管理プラットフォーム
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative" }}>
          {/* ユーザー名 */}
          <span style={{ fontSize: "15px", fontWeight: 600, color: "#374151" }}>
            {session?.user?.name ?? "ゲスト"}
          </span>

          {/* ≡ メニューボタン */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            style={{
              background: "none",
              border: "1.5px solid #d1d5db",
              borderRadius: "8px",
              padding: "6px 10px",
              cursor: "pointer",
              fontSize: "18px",
              color: "#374151",
              lineHeight: 1,
            }}
          >
            ≡
          </button>

          {/* ドロップダウンメニュー */}
          {menuOpen && (
            <>
              {/* 背景クリックで閉じる */}
              <div
                onClick={() => setMenuOpen(false)}
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 10,
                }}
              />
              <div style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                minWidth: "160px",
                zIndex: 20,
                overflow: "hidden",
              }}>
                <button
                  onClick={() => { setMenuOpen(false); router.push("/settings"); }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "12px 16px",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#374151",
                    cursor: "pointer",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
                >
                  ⚙️ ユーザー設定
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "12px 16px",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#dc2626",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#fef2f2"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
                >
                  🚪 ログアウト
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* メインコンテンツ */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
      }}>
        <div style={{
          width: "100%",
          maxWidth: "480px",
          background: "rgba(255,255,255,0.95)",
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
          padding: "48px 40px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎲</div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#1e293b", marginBottom: "8px" }}>
            ようこそ、{session?.user?.name ?? "ゲスト"} さん！
          </h1>
          <p style={{ fontSize: "15px", color: "#6b7280", marginTop: "8px" }}>
            ログインに成功しました。
          </p>
        </div>
      </div>
    </main>
  );
}