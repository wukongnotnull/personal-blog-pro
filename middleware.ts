import createMiddleware from "next-intl/middleware";
import { routing } from "./routing";

export default createMiddleware(routing);

export const config = {
  // Match all paths except static files, API routes, and admin routes (which don't use i18n)
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|admin|admin/).*)",
  ],
};
