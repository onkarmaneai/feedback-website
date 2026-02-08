"use client";

import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale);

type PieResponse = {
  labels: string[];
  data: number[];
  totalFeedback: number;
  totalQuestions: number;
  answeredRate: number;
  last7Days: number;
};

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<PieResponse | null>(null);
  const [mode, setMode] = useState<"category" | "sentiment">("category");

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/analytics/feedback-pie?mode=${mode}`);
      if (res.ok) {
        setMetrics(await res.json());
      }
    };
    load();
  }, [mode]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-sm text-gray-500">Feedback insights for the last 30 days.</p>
        </div>
        <select
          value={mode}
          onChange={(event) => setMode(event.target.value as "category" | "sentiment")}
          className="rounded-full border border-border px-4 py-2 text-sm"
        >
          <option value="category">Category breakdown</option>
          <option value="sentiment">Sentiment breakdown</option>
        </select>
      </div>

      {metrics ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card p-6">
            <Pie
              data={{
                labels: metrics.labels,
                datasets: [
                  {
                    data: metrics.data,
                    backgroundColor: [
                      "#0F172A",
                      "#1E293B",
                      "#334155",
                      "#475569",
                      "#64748B"
                    ]
                  }
                ]
              }}
            />
          </div>
          <div className="space-y-4">
            <div className="card p-4">
              <p className="text-xs uppercase text-gray-400">Total feedback</p>
              <p className="text-2xl font-semibold">{metrics.totalFeedback}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs uppercase text-gray-400">Total questions</p>
              <p className="text-2xl font-semibold">{metrics.totalQuestions}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs uppercase text-gray-400">Answered rate</p>
              <p className="text-2xl font-semibold">{Math.round(metrics.answeredRate)}%</p>
            </div>
            <div className="card p-4">
              <p className="text-xs uppercase text-gray-400">Last 7 days</p>
              <p className="text-2xl font-semibold">{metrics.last7Days}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-gray-500">Loading analytics...</p>
      )}
    </div>
  );
}
