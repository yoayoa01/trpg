"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Usersetting() {
  const router = useRouter();
  const { data: session } = useSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const authProvider = (session?.user as any)?.authProvider;
  const isSocialLogin =
    authProvider === "google" || authProvider === "discord";

  const openPasswordModal = () => {
    if (isSocialLogin) {
      alert("SNS連携のためパスワードは変更できません。");
      return;
    }

    setPasswordError("");
    setPasswordMessage("");
    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordConfirm("");
    setPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    if (loading) return;
    setPasswordModalOpen(false);
  };

  const handleSavePassword = async () => {
    setPasswordError("");
    setPasswordMessage("");

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      setPasswordError("すべての項目を入力してください。");
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setPasswordError("新しいパスワードが一致しません。");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("現在のパスワードと新しいパスワードが同じです。");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.error ?? "パスワード変更に失敗しました。");
        return;
      }

      setPasswordMessage("パスワードを変更しました。");

      setTimeout(() => {
        setPasswordModalOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setNewPasswordConfirm("");
        setPasswordMessage("");
      }, 1000);
    } catch (error) {
      console.error(error);
      setPasswordError("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const ok = window.confirm(
      "本当にアカウントを削除しますか？この操作は元に戻せません。"
    );

    if (!ok) return;

    try {
      const res = await fetch("/api/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error ?? "アカウント削除に失敗しました。");
        return;
      }

      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error(error);
      alert("通信エラーが発生しました。");
    }
  };

  return (
    <>
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
            justifyContent: "space-between",
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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              position: "relative",
            }}
          >
            <span
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#374151",
              }}
            >
              {session?.user?.name ?? "ゲスト"}
            </span>

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

            {menuOpen && (
              <>
                <div
                  onClick={() => setMenuOpen(false)}
                  style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 10,
                  }}
                />
                <div
                  style={{
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
                  }}
                >
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/mypage");
                    }}
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
                  >
                    🏠 マイページ
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
                  >
                    🚪 ログアウト
                  </button>
                </div>
              </>
            )}
          </div>
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
              maxWidth: "520px",
              background: "rgba(255,255,255,0.95)",
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
              padding: "44px 36px 36px",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div style={{ fontSize: "42px", marginBottom: "12px" }}>⚙️</div>
              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                ユーザー設定
              </h1>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  marginTop: "10px",
                  marginBottom: 0,
                }}
              >
                アカウント情報の確認と変更ができます
              </p>
            </div>

            <div style={{ display: "grid", gap: "20px" }}>
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
                  ログインID
                </label>
                <input
                  type="text"
                  value={session?.user?.name ?? ""}
                  readOnly
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    border: "1.5px solid #d1d5db",
                    background: "#f8fafc",
                    padding: "11px 14px",
                    fontSize: "15px",
                    color: "#64748b",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <p
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                    marginTop: "8px",
                    marginBottom: 0,
                  }}
                >
                  ログインIDは変更できません
                </p>
              </div>

              <button
                onClick={openPasswordModal}
                style={{
                  borderRadius: "10px",
                  background: isSocialLogin ? "#94a3b8" : "#3b82f6",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "16px",
                  padding: "12px 0",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                パスワード変更
              </button>

              <button
                onClick={handleDeleteAccount}
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  background: "#ef4444",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "16px",
                  padding: "12px 0",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                アカウント削除
              </button>
            </div>
          </div>
        </div>
      </main>

      {passwordModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "24px",
          }}
          onClick={closePasswordModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "800px",
              background: "#2f343c",
              border: "1px solid #4b5563",
              borderRadius: "6px",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
              position: "relative",
              zIndex: 1001,
              pointerEvents: "auto",
            }}
          >
            <div
              style={{
                background: "#2b3038",
                padding: "22px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: "#ffffff",
                  fontSize: "28px",
                  fontWeight: 800,
                }}
              >
                パスワード変更
              </h2>

              <button
                onClick={closePasswordModal}
                disabled={loading}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "4px",
                  border: "1px solid #6b7280",
                  background: "#4b5563",
                  color: "#ffffff",
                  fontSize: "28px",
                  cursor: loading ? "default" : "pointer",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                background: "#3f444b",
                padding: "20px",
              }}
            >
              {passwordError && (
                <div
                  style={{
                    marginBottom: "16px",
                    padding: "12px 14px",
                    borderRadius: "4px",
                    background: "#7f1d1d",
                    color: "#ffffff",
                    fontSize: "14px",
                  }}
                >
                  {passwordError}
                </div>
              )}

              {passwordMessage && (
                <div
                  style={{
                    marginBottom: "16px",
                    padding: "12px 14px",
                    borderRadius: "4px",
                    background: "#14532d",
                    color: "#ffffff",
                    fontSize: "14px",
                  }}
                >
                  {passwordMessage}
                </div>
              )}

              <div style={{ display: "grid", gap: "18px" }}>
                <div>
                  <label
                    htmlFor="currentPassword"
                    style={{
                      display: "block",
                      color: "#ffffff",
                      fontSize: "16px",
                      fontWeight: 700,
                      marginBottom: "8px",
                    }}
                  >
                    現在のパスワード
                  </label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    style={{
                      width: "100%",
                      height: "48px",
                      borderRadius: "4px",
                      border: "1px solid #d1d5db",
                      background: "#ffffff",
                      color: "#111827",
                      caretColor: "#111827",
                      padding: "0 14px",
                      fontSize: "16px",
                      boxSizing: "border-box",
                      outline: "none",
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    style={{
                      display: "block",
                      color: "#ffffff",
                      fontSize: "16px",
                      fontWeight: 700,
                      marginBottom: "8px",
                    }}
                  >
                    新しいパスワード
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      width: "100%",
                      height: "48px",
                      borderRadius: "4px",
                      border: "1px solid #9ca3af",
                      background: "#6b7280",
                      color: "#ffffff",
                      caretColor: "#ffffff",
                      padding: "0 14px",
                      fontSize: "16px",
                      boxSizing: "border-box",
                      outline: "none",
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="newPasswordConfirm"
                    style={{
                      display: "block",
                      color: "#ffffff",
                      fontSize: "16px",
                      fontWeight: 700,
                      marginBottom: "8px",
                    }}
                  >
                    新しいパスワード確認
                  </label>
                  <input
                    id="newPasswordConfirm"
                    name="newPasswordConfirm"
                    type="password"
                    autoComplete="new-password"
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    style={{
                      width: "100%",
                      height: "48px",
                      borderRadius: "4px",
                      border: "1px solid #9ca3af",
                      background: "#6b7280",
                      color: "#ffffff",
                      caretColor: "#ffffff",
                      padding: "0 14px",
                      fontSize: "16px",
                      boxSizing: "border-box",
                      outline: "none",
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#2b3038",
                padding: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <button
                onClick={closePasswordModal}
                disabled={loading}
                style={{
                  padding: "12px 18px",
                  borderRadius: "4px",
                  border: "1px solid #6b7280",
                  background: "#4b5563",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: loading ? "default" : "pointer",
                }}
              >
                キャンセル
              </button>

              <button
                onClick={handleSavePassword}
                disabled={loading}
                style={{
                  padding: "12px 18px",
                  borderRadius: "4px",
                  border: "none",
                  background: "#3b82f6",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: loading ? "default" : "pointer",
                  minWidth: "120px",
                }}
              >
                {loading ? "変更中..." : "変更する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}