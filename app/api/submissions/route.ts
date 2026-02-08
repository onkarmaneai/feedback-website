import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { generateDisplayIdentity } from "../../lib/identity";
import { containsProfanity } from "../../lib/moderation";
import { isRateLimited } from "../../lib/rateLimit";
import { requireAdmin } from "../../lib/auth";

const feedbackSchema = z.object({
  type: z.literal("feedback"),
  category: z.string().min(1),
  sentiment: z.enum(["positive", "neutral", "negative"]),
  text: z.string().min(5),
  tags: z.string().optional().nullable()
});

const questionSchema = z.object({
  type: z.literal("question"),
  category: z.string().min(1),
  text: z.string().min(5)
});

const submissionSchema = z.discriminatedUnion("type", [feedbackSchema, questionSchema]);

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded. Please wait." }, { status: 429 });
  }

  const json = await request.json();
  const parsed = submissionSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const recentNames = await prisma.submission.findMany({
    select: { randomDisplayName: true },
    orderBy: { createdAt: "desc" },
    take: 40
  });
  const usedNames = new Set(recentNames.map((entry) => entry.randomDisplayName));
  const identity = generateDisplayIdentity(usedNames);

  const status = containsProfanity(parsed.data.text) ? "hidden" : "visible";

  const submission = await prisma.submission.create({
    data: {
      type: parsed.data.type,
      category: parsed.data.category,
      sentiment: parsed.data.type === "feedback" ? parsed.data.sentiment : null,
      text: parsed.data.text,
      tags: parsed.data.type === "feedback" ? parsed.data.tags ?? null : null,
      randomDisplayName: identity.name,
      avatarColor: identity.color,
      status
    }
  });

  return NextResponse.json({ item: submission });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  const answered = searchParams.get("answered");
  const featured = searchParams.get("featured");
  const limit = Number(searchParams.get("limit") || 20);
  const offset = Number(searchParams.get("offset") || 0);
  const isAdminRequest = searchParams.get("admin") === "true";

  const isAdmin = isAdminRequest ? requireAdmin() : false;

  const where: Record<string, unknown> = {
    status: isAdmin ? undefined : "visible"
  };

  if (type) {
    where.type = type;
  }

  if (category) {
    where.category = category;
  }

  if (featured) {
    where.featured = featured === "true";
  }

  if (answered) {
    if (answered === "true") {
      where.answer = { isPublished: true };
    } else {
      where.OR = [{ answer: null }, { answer: { isPublished: false } }];
    }
  }

  const items = await prisma.submission.findMany({
    where,
    include: { answer: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: Math.min(limit, 100),
    skip: offset
  });

  return NextResponse.json({ items });
}
