import { NextResponse } from "next/server";
import { calculateFuelAverages } from "@/lib/fuelUtils";

export async function GET() {
  const res = await fetch(
    "https://henrikhjelm.se/api/getdata.php?lan=stockholms-lan"
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch fuel prices" },
      { status: 500 }
    );
  }

  const raw = await res.json();
  const averages = calculateFuelAverages(raw);

  return NextResponse.json(averages);
}
