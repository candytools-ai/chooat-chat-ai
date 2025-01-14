import { createNavigation, createSharedPathnamesNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import { locales, localePrefix } from "@/config/site";

export const routing = defineRouting({
    locales,
    defaultLocale: "en",
    localePrefix
});

export type Locale = (typeof routing.locales)[number];

export const { Link, getPathname, redirect, usePathname, useRouter } =
    createNavigation(routing);
