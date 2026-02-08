import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/auth";

export async function GET(request: Request) {
  const allowPublic = process.env.PUBLIC_ANALYTICS === "true";
  if (!allowPublic && !requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") === "sentiment" ? "sentiment" : "category";

  const feedbackItems = await prisma.submission.findMany({
    where: { type: "feedback", status: "visible" },
    select: { category: true, sentiment: true }
  });

  const map = new Map<string, number>();
  for (const item of feedbackItems) {
    const key = mode === "sentiment" ? item.sentiment ?? "neutral" : item.category;
    map.set(key, (map.get(key) || 0) + 1);
  }

  const labels = Array.from(map.keys());
  const data = labels.map((label) => map.get(label) || 0);

  const totalFeedback = feedbackItems.length;
  const totalQuestions = await prisma.submission.count({
    where: { type: "question", status: "visible" }
  });

  const answeredCount = await prisma.answer.count({
    where: { isPublished: true }
  });

  const totalSubmissions = await prisma.submission.count({
    where: { status: "visible" }
  });

  const last7Days = await prisma.submission.count({
    where: {
      status: "visible",
      createdAt: { gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) }
    }
  });

  return NextResponse.json({
    labels,
    data,
    totalFeedback,
    totalQuestions,
    answeredRate: totalSubmissions ? (answeredCount / totalSubmissions) * 100 : 0,
    last7Days
  });
}
