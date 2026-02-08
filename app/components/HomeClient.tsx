"use client";

import { useState } from "react";
import Composer from "./Composer";
import Feed from "./Feed";

export default function HomeClient() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-6">
        <div className="card p-6">
          <h2 className="text-2xl font-semibold text-gray-900">Share feedback in seconds.</h2>
          <p className="mt-2 text-sm text-gray-600">
            AnonPulse makes it easy to collect anonymous feedback and questions. Every submission
            gets a fun name and shows up instantly on the board.
          </p>
        </div>
        <Composer onSubmitSuccess={() => setRefreshKey((prev) => prev + 1)} />
      </div>
      <div className="space-y-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Live Board</h3>
          <p className="text-sm text-gray-500">Recent feedback and questions from the community.</p>
        </div>
        <Feed refreshKey={refreshKey} />
      </div>
    </div>
  );
}
