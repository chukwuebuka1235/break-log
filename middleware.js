import { NextResponse } from "next/server";

export function middleware(request) {
  const response = NextResponse.next();

  // 1. CORS HEADERS RO ALLOW ME CONNECT WITH MY VERCEL APP
  const allowedOrigins = [
    "https://break-log.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001",
  ];

  const origin = request.headers.get("origin");

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");

  // ADMIN AUTH CHECK
  if (request.nextUrl.pathname.startsWith("/admin/dashboard")) {
    const isAdminAuthenticated = request.cookies.get("admin-authenticated");

    if (!isAdminAuthenticated || isAdminAuthenticated.value !== "true") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: response.headers,
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/api/:path*", // Apply CORS to all API routes
    "/admin/dashboard/:path*", // Apply auth check to admin routes
  ],
};
