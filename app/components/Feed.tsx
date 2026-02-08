"use client";

import { useEffect, useMemo, useState } from "react";
import { formatDate, labelType } from "../lib/utils";

const typeFilters = ["all", "feedback", "question", "answered", "unanswered", "featured"] as const;

type Submission = {
  id: string;
  type: "feedback" | "question";
  category: string;
  sentiment?: "positive" | "neutral" | "negative" | null;
  text: string;
  tags?: string | null;
  randomDisplayName: string;
  avatarColor: string;
  createdAt: string;
  featured: boolean;
  answer?: {
    id: string;
    text: string;
    isPublished: boolean;
  } | null;
};

export default function Feed({ refreshKey }: { refreshKey: number }) {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<(typeof typeFilters)[number]>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch("/api/submissions?limit=50");
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [refreshKey]);

  const categories = useMemo(() => {
    const unique = new Set(items.map((item) => item.category));
    return ["all", ...Array.from(unique)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      if (typeFilter === "feedback" && item.type !== "feedback") return false;
      if (typeFilter === "question" && item.type !== "question") return false;
      if (typeFilter === "answered" && (!item.answer || !item.answer.isPublished)) return false;
      if (typeFilter === "unanswered" && item.answer?.isPublished) return false;
      if (typeFilter === "featured" && !item.featured) return false;
      return true;
    });
  }, [items, typeFilter, categoryFilter]);

  const copyLink = async (id: string) => {
    const url = `${window.location.origin}/item/${id}`;
    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {typeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setTypeFilter(filter)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                typeFilter === filter ? "border-black bg-black text-white" : "border-border text-gray-600"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-gray-600"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-gray-500">Loading feed...</p>
        ) : filteredItems.length === 0 ? (
          <p className="text-sm text-gray-500">No submissions yet.</p>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="card-muted p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: item.avatarColor }}
                  >
                    {item.randomDisplayName
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.randomDisplayName}</p>
                    <p className="text-xs text-gray-500">
                      {labelType(item.type)} · {item.category} · {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.type === "feedback" && item.sentiment && (
                    <span
                      className={`badge ${
                        item.sentiment === "positive"
                          ? "bg-emerald-100 text-emerald-700"
                          : item.sentiment === "neutral"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {item.sentiment}
                    </span>
                  )}
                  {item.featured && <span className="badge bg-black text-white">Featured</span>}
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-700">{item.text}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>{item.tags ? `Tags: ${item.tags}` : ""}</span>
                <button
                  type="button"
                  onClick={() => copyLink(item.id)}
                  className="font-semibold text-gray-700 hover:text-black"
                >
                  Copy link
                </button>
              </div>
              {item.answer?.isPublished && (
                <div className="mt-4 rounded-xl border border-black/10 bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase text-gray-400">Answer</p>
                  <p className="mt-1 text-sm text-gray-800">{item.answer.text}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
