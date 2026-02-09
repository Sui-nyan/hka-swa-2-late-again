import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
}

export async function HEAD(request: Request) {}

export async function POST(request: Request) {}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}
