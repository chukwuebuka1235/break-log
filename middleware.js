import { NextResponse } from "next/server";

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    const isAdminAuthenticated = request.cookies.get('admin-authenticated');
    
    if (!isAdminAuthenticated || isAdminAuthenticated.value !== 'true') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/dashboard/:path*',
};