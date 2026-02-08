import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/auth";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const item = await prisma.submission.findUnique({
    where: { id: params.id },
    include: { answer: true }
  });

  if (!item || item.status === "hidden") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (typeof body.featured === "boolean") {
    data.featured = body.featured;
  }

  if (body.status === "visible" || body.status === "hidden") {
    data.status = body.status;
  }

  const updated = await prisma.submission.update({
    where: { id: params.id },
    data
  });

  return NextResponse.json({ item: updated });
}
