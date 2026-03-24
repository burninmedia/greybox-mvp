// NOTE: This middleware is a NO-OP for GitHub Pages static deployment.
// Auth is handled client-side via localStorage/sessionStorage.
// For Vercel production deployment, restore the real Clerk middleware:
//   import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
//   const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
//   export default clerkMiddleware(async (auth, req) => {
//     if (isProtectedRoute(req)) { await auth.protect(); }
//   });

// GitHub Pages has no server-side auth — all pages are public.
// The dashboard checks localStorage client-side and redirects if not logged in.

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
