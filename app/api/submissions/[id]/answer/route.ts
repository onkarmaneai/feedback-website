import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/auth";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  if (!requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const text = body.text as string | undefined;
  const isPublished = Boolean(body.isPublished);

  if (!text || text.length < 2) {
    return NextResponse.json({ error: "Answer text is required." }, { status: 400 });
  }

  const existing = await prisma.answer.findUnique({
    where: { submissionId: params.id }
  });

  const answer = existing
    ? await prisma.answer.update({
        where: { submissionId: params.id },
        data: { text, isPublished }
      })
    : await prisma.answer.create({
        data: { submissionId: params.id, text, isPublished }
      });

  return NextResponse.json({ answer });
}
