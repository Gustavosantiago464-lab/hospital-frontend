import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  if (
    body.usuario === "admin" &&
    body.senha === "123"
  ) {
    return NextResponse.json({
      sucesso: true,
    });
  }

  return NextResponse.json({
    sucesso: false,
  });
}