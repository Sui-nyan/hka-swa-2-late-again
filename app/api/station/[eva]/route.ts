import { stationRepository } from "@/lib/repositories/stationRepository";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eva: string }> },
) {
  const evaString = await params.then((p) => p.eva);
  const eva = parseInt(evaString);
  const station = await stationRepository.getOne(eva);
  return NextResponse.json(station);
}
