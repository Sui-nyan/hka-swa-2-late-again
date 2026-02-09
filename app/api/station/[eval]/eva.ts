import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { eva: string } },
) {
  // const user = await prisma.user.findUnique({
  //   where: {
  //     email: "elsa@prisma.io",
  //   },
  // });

  const evalId = params.eva;

  return NextResponse.json({ id: evalId });
}
