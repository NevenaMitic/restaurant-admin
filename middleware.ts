import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Definiše koje rute treba zaštititi
const isProtectedRoute = createRouteMatcher([
  '/collections',
  '/collections/new',
  '/products',
  '/products/new',
  '/orders',
  '/customers',
  '/'
  
]);
// Middleware za zaštitu ruta koristeći Clerk
export default clerkMiddleware((auth, request) => {
  if (isProtectedRoute(request)) { 
    auth().protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)'],
};