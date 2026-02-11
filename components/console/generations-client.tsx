"use client";

import { FormEvent, useEffect, useState } from "react";

type Generation = {
  id: string;
  prompt: string;
  result: any;
  created_at: string;
};

const MOCK_USER_ID = "user-uuid-demo";

export default function GenerationsClient() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 在真实项目中，替换为 session.user.id 或调用自定义 API 获取当前用户
    setUserId(MOCK_USER_ID);
    fetchGenerations(MOCK_USER_ID);
  }, []);

  const fetchGenerations = async (uid: string) => {
    const res = await fetch(`/api/generations?userId=${uid}`);
    if (!res.ok) {
      console.error("Failed to fetch generations");
      return;
    }
    const payload = await res.json();
    setGenerations(payload.data ?? []);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!prompt || !result || !userId) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, result, userId }),
      });

      if (!res.ok) {
        console.error("Failed to insert generation");
        return;
      }

      const payload = await res.json();
      if (payload.data) {
        setGenerations((prev) => [payload.data, ...prev]);
        setPrompt("");
        setResult("");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    const newResult = JSON.stringify({ note: "Updated result", timestamp: Date.now() });
    const res = await fetch("/api/generations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, result: newResult, userId }),
    });

    if (!res.ok) {
      console.error("Failed to update generation");
      return;
    }

    const payload = await res.json();
    if (payload.data) {
      setGenerations((prev) => prev.map((item) => (item.id === id ? payload.data : item)));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-10">
      <div>
        <h1 className="text-2xl font-bold mb-4">AI 生成记录管理</h1>
        <p className="text-sm text-muted-foreground">
          以下示例通过调用内部 API（/api/generations）与 Supabase 通信，避免在浏览器暴露敏感密钥。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 border rounded-xl p-6">
        <div>
          <label className="block text-sm font-medium mb-1">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            className="w-full min-h-[100px] border rounded-md p-3 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">AI Result (JSON 或文本)</label>
          <textarea
            value={result}
            onChange={(e) => setResult(e.target.value)}
            required
            className="w-full min-h-[130px] border rounded-md p-3 text-sm"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md"
          disabled={loading}
        >
          {loading ? "保存中..." : "保存生成记录"}
        </button>
      </form>

      <section>
        <h2 className="text-xl font-semibold mb-4">历史记录</h2>
        {generations.length === 0 ? (
          <p className="text-sm text-muted-foreground">暂无数据</p>
        ) : (
          <ul className="space-y-4">
            {generations.map((gen) => (
              <li key={gen.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-base mb-2">
                  {gen.prompt.slice(0, 60)}
                  {gen.prompt.length > 60 ? "..." : ""}
                </h3>
                <pre className="text-xs bg-muted/40 rounded p-3 overflow-x-auto">
                  {typeof gen.result === 'string'
                    ? gen.result.slice(0, 200)
                    : JSON.stringify(gen.result, null, 2)}
                </pre>
                <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                  <span>创建时间：{new Date(gen.created_at).toLocaleString()}</span>
                  <button
                    className="text-primary hover:underline"
                    onClick={() => handleUpdate(gen.id)}
                  >
                    模拟更新
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
