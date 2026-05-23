import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data/content.json");

export async function GET() {
  try {
    const data = fs.readFileSync(filePath, "utf-8");

    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to load content" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    fs.writeFileSync(filePath, JSON.stringify(body, null, 2));

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 }
    );
  }
}