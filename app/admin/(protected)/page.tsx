"use client";

import { useEffect, useState } from "react";

type Submission = {
  id: string;
  type: "feedback" | "question";
  category: string;
  sentiment?: "positive" | "neutral" | "negative" | null;
  text: string;
  randomDisplayName: string;
  createdAt: string;
  featured: boolean;
  status: "visible" | "hidden";
  answer?: {
    id: string;
    text: string;
    isPublished: boolean;
  } | null;
};

export default function AdminDashboard() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("unanswered");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/submissions?admin=true");
    if (res.ok) {
      const data = await res.json();
      setItems(data.items || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = items.filter((item) => {
    const matchesSearch = item.text.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "unanswered"
        ? !item.answer?.isPublished
        : filter === "answered"
        ? item.answer?.isPublished
        : true;
    return matchesSearch && matchesFilter;
  });

  const toggleFeatured = async (id: string, featured: boolean) => {
    await fetch(`/api/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !featured })
    });
    load();
  };

  const toggleVisibility = async (id: string, status: "visible" | "hidden") => {
    await fetch(`/api/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: status === "visible" ? "hidden" : "visible" })
    });
    load();
  };

  const saveAnswer = async (id: string, text: string, isPublished: boolean) => {
    await fetch(`/api/submissions/${id}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, isPublished })
    });
    load();
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Admin dashboard</h1>
          <p className="text-sm text-gray-500">Manage answers, featured items, and moderation.</p>
        </div>
        <a
          href="/admin/analytics"
          className="rounded-full border border-black px-4 py-2 text-sm font-semibold"
        >
          View analytics
        </a>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search submissions"
          className="w-full max-w-xs rounded-full border border-border px-4 py-2 text-sm"
        />
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="rounded-full border border-border px-3 py-2 text-sm"
        >
          <option value="all">All</option>
          <option value="unanswered">Unanswered</option>
          <option value="answered">Answered</option>
        </select>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          filtered.map((item) => (
            <AdminItem
              key={item.id}
              item={item}
              onToggleFeatured={toggleFeatured}
              onToggleVisibility={toggleVisibility}
              onSaveAnswer={saveAnswer}
            />
          ))
        )}
      </div>
    </div>
  );
}

function AdminItem({
  item,
  onToggleFeatured,
  onToggleVisibility,
  onSaveAnswer
}: {
  item: Submission;
  onToggleFeatured: (id: string, featured: boolean) => void;
  onToggleVisibility: (id: string, status: "visible" | "hidden") => void;
  onSaveAnswer: (id: string, text: string, isPublished: boolean) => void;
}) {
  const [answerText, setAnswerText] = useState(item.answer?.text || "");
  const [publish, setPublish] = useState(item.answer?.isPublished ?? false);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">{item.type}</p>
          <h3 className="text-lg font-semibold text-gray-900">{item.category}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFeatured(item.id, item.featured)}
            className="rounded-full border border-border px-3 py-1 text-xs font-semibold"
          >
            {item.featured ? "Unfeature" : "Feature"}
          </button>
          <button
            onClick={() => onToggleVisibility(item.id, item.status)}
            className="rounded-full border border-border px-3 py-1 text-xs font-semibold"
          >
            {item.status === "visible" ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-700">{item.text}</p>
      <div className="mt-4">
        <label className="text-xs font-semibold uppercase text-gray-400">Answer</label>
        <textarea
          value={answerText}
          onChange={(event) => setAnswerText(event.target.value)}
          className="mt-2 min-h-[100px] w-full rounded-xl border border-border px-3 py-2 text-sm"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={publish}
              onChange={(event) => setPublish(event.target.checked)}
            />
            Publish answer
          </label>
          <button
            onClick={() => onSaveAnswer(item.id, answerText, publish)}
            className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            Save answer
          </button>
        </div>
      </div>
    </div>
  );
}
