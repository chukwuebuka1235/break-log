// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  console.log(`Middleware checking: ${pathname}`);

  // ADMIN ROUTES - Only accessible with admin cookie
  if (pathname.startsWith("/admin/")) {
    console.log("Admin route detected");

    const adminCookie = request.cookies.get("admin-authenticated");
    const employeeCookie = request.cookies.get("employee-authenticated");

    console.log(
      `Admin cookie: ${!!adminCookie}, Employee cookie: ${!!employeeCookie}`
    );

    // Strict check: Only allow if admin cookie exists AND no employee cookie
    if (!adminCookie || employeeCookie) {
      console.log("Access denied to admin area");
      // Clear any employee cookies if trying to access admin area
      const response = NextResponse.redirect(new URL("/login", request.url));
      if (employeeCookie) {
        response.cookies.delete("employee-authenticated");
        response.cookies.delete("employee-id");
      }
      return response;
    }

    console.log("Admin access granted");
    return NextResponse.next();
  }

  // EMPLOYEE ROUTES - Only accessible with employee cookie
  if (pathname === "/") {
    console.log("Employee route detected");

    const adminCookie = request.cookies.get("admin-authenticated");
    const employeeCookie = request.cookies.get("employee-authenticated");

    console.log(
      `Admin cookie: ${!!adminCookie}, Employee cookie: ${!!employeeCookie}`
    );

    // Strict check: Only allow if employee cookie exists AND no admin cookie
    if (!employeeCookie || adminCookie) {
      console.log("Access denied to employee area");
      // Clear any admin cookies if trying to access employee area
      const response = NextResponse.redirect(new URL("/login", request.url));
      if (adminCookie) {
        response.cookies.delete("admin-authenticated");
      }
      return response;
    }

    console.log("Employee access granted");
    return NextResponse.next();
  }

  // For all other routes, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin", "/admin/:path*"],
};
