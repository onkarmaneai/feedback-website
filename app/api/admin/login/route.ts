import { NextResponse } from "next/server";
import { setAdminSession } from "../../../lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const password = body.password as string | undefined;

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Missing ADMIN_PASSWORD env var." }, { status: 500 });
  }

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  setAdminSession();
  return NextResponse.json({ ok: true });
}
