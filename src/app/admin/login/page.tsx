"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
      <div className="bg-neutral-900 p-8 rounded-xl w-full max-w-sm">

        <button
          onClick={() => router.push("/")}
          className="text-sm text-neutral-400 hover:text-white mb-4"
        >
          ← Back to site
        </button>

        <h1 className="text-2xl font-bold mb-6">
          Admin Login
        </h1>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded bg-neutral-800 mb-4 outline-none"
        />

        <button
          type="button"
          onClick={handleLogin}
          className="w-full bg-green-400 text-black py-3 rounded-lg font-semibold hover:bg-green-300 transition"
        >
          Login
        </button>

        {error && (
          <p className="text-red-400 mt-4 text-sm">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}