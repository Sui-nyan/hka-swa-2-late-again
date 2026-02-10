import { NextRequest } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const stations = await prisma.station.findMany();
  return Response.json(stations);
}

export async function HEAD(request: Request) {}

export async function POST(request: Request) {}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}
