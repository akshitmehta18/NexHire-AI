import { type NextRequest, NextResponse } from "next/server";
import { getCategories } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const company = searchParams.get("company") || undefined;
    const categories = await getCategories(company);
    return NextResponse.json(categories || []);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(["Technical", "DSA", "System Design", "Behavioral", "Aptitude"]);
  }
}
