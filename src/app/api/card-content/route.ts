import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export async function GET(request: NextRequest) {
  const file = request.nextUrl.searchParams.get("file");
  if (!file) {
    return NextResponse.json({ error: "Missing file parameter" }, { status: 400 });
  }

  // Prevent path traversal
  const safeFile = file.replace(/\.\./g, "").replace(/\\/g, "/");
  const fullPath = path.join(process.cwd(), "content", "cards", safeFile);

  try {
    const raw = await fs.readFile(fullPath, "utf-8");
    const { data, content } = matter(raw);
    return NextResponse.json({ frontmatter: data, content });
  } catch {
    return NextResponse.json({ content: "" });
  }
}
