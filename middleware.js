import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  console.log(`Middleware checking: ${pathname}`);

  // ADMIN ROUTES 
  if (pathname.startsWith("/admin/")) {
    console.log("Admin route detected");

    const adminCookie = request.cookies.get("admin-authenticated");
    const employeeCookie = request.cookies.get("employee-authenticated");

    console.log(
      `Admin cookie: ${!!adminCookie}, Employee cookie: ${!!employeeCookie}`
    );

    if (!adminCookie || employeeCookie) {
      console.log("Access denied to admin area");
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

  // EMPLOYEE ROUTES 
  if (pathname === "/") {
    console.log("Employee route detected");

    const adminCookie = request.cookies.get("admin-authenticated");
    const employeeCookie = request.cookies.get("employee-authenticated");

    console.log(
      `Admin cookie: ${!!adminCookie}, Employee cookie: ${!!employeeCookie}`
    );

    if (!employeeCookie || adminCookie) {
      console.log("Access denied to employee area");
      const response = NextResponse.redirect(new URL("/login", request.url));
      if (adminCookie) {
        response.cookies.delete("admin-authenticated");
      }
      return response;
    }

    console.log("Employee access granted");
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin", "/admin/:path*"],
};
