"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin() {
    setError("");
    const res = await signIn("credentials", {
      userId,
      password,
      redirect: false,
    });
    if (res?.ok) {
      router.push("/mypage");
    } else {
      setError("IDまたはパスワードが間違っています");
    }
  }

  async function handleRegister() {
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, password }),
    });
    if (res.ok) {
      await signIn("credentials", {
        userId,
        password,
        redirect: false,
      });
      router.push("/mypage");
    } else {
      const data = await res.json();
      setError(data.error ?? "登録に失敗しました");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f0f4ff 0%, #fafafa 50%, #f5f0ff 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          padding: "16px 32px",
          borderBottom: "1px solid #e5e7eb",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: "#1e293b",
            letterSpacing: "-0.5px",
          }}
        >
          TRPG通過管理プラットフォーム
        </span>
      </header>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "440px",
            background: "rgba(255,255,255,0.95)",
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
            padding: "44px 40px 36px",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: "28px",
              fontWeight: 800,
              color: "#1e293b",
              marginBottom: "32px",
            }}
          >
            ログイン
          </h2>

          {error && (
            <div
              style={{
                marginBottom: "16px",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "#fef2f2",
                color: "#dc2626",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                ID（ユーザー名）
              </label>
              <input
                type="text"
                placeholder="ユーザーIDを入力"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  border: "1.5px solid #d1d5db",
                  background: "#f8fafc",
                  padding: "11px 14px",
                  fontSize: "15px",
                  color: "#1e293b",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                パスワード
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="パスワードを入力"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    border: "1.5px solid #d1d5db",
                    background: "#f8fafc",
                    padding: "11px 44px 11px 14px",
                    fontSize: "15px",
                    color: "#1e293b",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    color: "#9ca3af",
                  }}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ width: "20px", height: "20px" }}
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58" />
                      <path d="M9.88 5.09A10.94 10.94 0 0112 5c5 0 9.27 3.11 11 7-1.01 2.27-2.73 4.2-4.88 5.43" />
                      <path d="M6.61 6.61C4.62 7.87 3.03 9.76 2 12c1.73 3.89 6 7 10 7 1.85 0 3.62-.46 5.18-1.27" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ width: "20px", height: "20px" }}
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                marginTop: "4px",
              }}
            >
              <button
                onClick={handleLogin}
                style={{
                  borderRadius: "10px",
                  background: "#22c55e",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "16px",
                  padding: "12px 0",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ログイン
              </button>
              <button
                onClick={handleRegister}
                style={{
                  borderRadius: "10px",
                  background: "#3b82f6",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "16px",
                  padding: "12px 0",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                新規登録
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}