import type { Metadata } from "next";
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { routing } from "@/i18n/routing";
import { Toaster } from "sonner";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { auth } from "../(auth)/auth";
import { Navbar } from "@/components/layout/navbar";
import FooterSection from "@/components/layout/footer";
import ModalProvider from "@/components/modals/providers";
import { fontGeist, fontHeading, fontSans, fontUrban, fontSatoshi } from "@/assets/fonts";
import { cn } from "@/lib/utils";

type Props = {
    children: ReactNode;
    params: { locale: string };
};

export const viewport = {
    maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const LIGHT_THEME_COLOR = "hsl(0 0% 100%)";
const DARK_THEME_COLOR = "hsl(240deg 10% 3.92%)";
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default async function RootLayout({
    children,
    params, //: { locale },
}: Props) {
    const { locale } = await params;
    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    const messages = await getMessages();
    const session = await auth();

    return (
        <html lang={locale} suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: THEME_COLOR_SCRIPT,
                    }}
                />
            </head>
            <body
                className={cn(
                    "min-h-screen bg-background font-sans antialiased",
                    fontSans.variable,
                    fontUrban.variable,
                    fontHeading.variable,
                    fontGeist.variable,
                    fontSatoshi.variable,
                )}
            >
                <NextIntlClientProvider messages={messages}>
                    <SessionProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                            disableTransitionOnChange
                        >
                            <ModalProvider>
                                <Navbar />
                                {children}
                                <FooterSection />
                            </ModalProvider>
                            <Toaster position="top-center" richColors />
                        </ThemeProvider>
                    </SessionProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
