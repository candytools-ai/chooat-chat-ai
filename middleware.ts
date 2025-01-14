import createMiddleware from "next-intl/middleware";
import { defaultLocale, localePrefix, localeDetection, locales } from "@/config/site";
import { NextRequest, NextResponse } from "next/server";

const handleI18nRouting = createMiddleware({
  // A list of all locales that are supported
  locales: locales,
  localePrefix: localePrefix,
  // pathnames: pathnames,
  // Used when no locale matches
  defaultLocale: defaultLocale,
  localeDetection: localeDetection
});


export default function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);

  // 检查特定条件
  if (request.nextUrl.pathname === '/chat') {
    // 重定向到新页面
    return NextResponse.redirect(`${process.env.AUTH_URL}/chat/gpt-4o`);
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    // '/(ar|cn|de|en|es|fr|it|ja|ko|pt|ru)/:path*',

    "/((?!api|_next|.*\\..*).*)",
  ],
};
