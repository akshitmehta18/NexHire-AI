import { type NextRequest, NextResponse } from "next/server";
import { getUserGuidanceSessions } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get("x-user-email") || "user@example.com";
    const sessions = await getUserGuidanceSessions(userEmail);
    return NextResponse.json(sessions || []);
  } catch (error) {
    console.error("Error fetching guidance history:", error);
    return NextResponse.json([]);
  }
}
