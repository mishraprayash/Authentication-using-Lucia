import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  console.log("Middlweware");
  console.log(req.headers);
  return NextResponse.next();
}

export const config = { matcher: "/authenticate" };
