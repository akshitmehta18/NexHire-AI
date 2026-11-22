import { NextResponse } from "next/server";
import { getCompanies } from "@/lib/database";

export async function GET() {
  try {
    const companies = await getCompanies();
    return NextResponse.json(companies || []);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(["Google", "Amazon", "Microsoft", "Meta", "TCS", "Apple", "Netflix"]);
  }
}
