"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";

type ComposerProps = {
  onSubmitSuccess: () => void;
};

const categories = ["Product", "Support", "Pricing", "UX", "Other"];

export default function Composer({ onSubmitSuccess }: ComposerProps) {
  const [activeTab, setActiveTab] = useState("feedback");
  const [formState, setFormState] = useState({
    category: "Product",
    sentiment: "positive",
    text: "",
    tags: "",
    questionCategory: "",
    questionText: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const update = (key: string, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    if (activeTab === "feedback" && formState.text.trim().length < 5) {
      setMessage("Please add a bit more detail to your feedback.");
      return;
    }

    if (activeTab === "question" && formState.questionText.trim().length < 5) {
      setMessage("Please add a bit more detail to your question.");
      return;
    }

    setLoading(true);
    setMessage(null);

    const payload =
      activeTab === "feedback"
        ? {
            type: "feedback",
            category: formState.category,
            sentiment: formState.sentiment,
            text: formState.text,
            tags: formState.tags
          }
        : {
            type: "question",
            category: formState.questionCategory || "General",
            text: formState.questionText
          };

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Unable to submit right now.");
      } else {
        setMessage("Submitted! Thanks for sharing.");
        setFormState((prev) => ({
          ...prev,
          text: "",
          tags: "",
          questionText: ""
        }));
        onSubmitSuccess();
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="composer" className="card p-6">
      <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <Tabs.List className="flex rounded-full bg-black/5 p-1">
          <Tabs.Trigger
            value="feedback"
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === "feedback" ? "bg-black text-white" : "text-gray-600"
            }`}
          >
            Feedback
          </Tabs.Trigger>
          <Tabs.Trigger
            value="question"
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === "question" ? "bg-black text-white" : "text-gray-600"
            }`}
          >
            Question
          </Tabs.Trigger>
        </Tabs.List>

        {activeTab === "feedback" ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold text-gray-700">
                Category
                <select
                  value={formState.category}
                  onChange={(event) => update("category", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold text-gray-700">
                Sentiment
                <select
                  value={formState.sentiment}
                  onChange={(event) => update("sentiment", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2"
                >
                  <option value="positive">Positive</option>
                  <option value="neutral">Neutral</option>
                  <option value="negative">Negative</option>
                </select>
              </label>
            </div>
            <label className="text-sm font-semibold text-gray-700">
              Feedback
              <textarea
                value={formState.text}
                onChange={(event) => update("text", event.target.value)}
                placeholder="Share what's on your mind..."
                className="mt-2 min-h-[140px] w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
                required
              />
            </label>
            <label className="text-sm font-semibold text-gray-700">
              Tags (optional)
              <input
                value={formState.tags}
                onChange={(event) => update("tags", event.target.value)}
                placeholder="e.g. onboarding, docs"
                className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm"
              />
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-700">
              Category (optional)
              <input
                value={formState.questionCategory}
                onChange={(event) => update("questionCategory", event.target.value)}
                placeholder="Support, Roadmap, etc"
                className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm"
              />
            </label>
            <label className="text-sm font-semibold text-gray-700">
              Question
              <textarea
                value={formState.questionText}
                onChange={(event) => update("questionText", event.target.value)}
                placeholder="Ask a question for the team..."
                className="mt-2 min-h-[140px] w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
                required
              />
            </label>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {message ? message : "Your name will be randomized automatically."}
          </p>
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="rounded-full bg-black px-6 py-2 text-sm font-semibold text-white hover:bg-gray-900 disabled:opacity-60"
          >
            {loading ? "Sending..." : activeTab === "feedback" ? "Send" : "Ask"}
          </button>
        </div>
      </Tabs.Root>
    </div>
  );
}
