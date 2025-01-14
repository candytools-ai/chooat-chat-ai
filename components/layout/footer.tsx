/* eslint-disable react/no-unescaped-entities */
"use client";

import footerNavs from "@/config/footer-navs";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import SocialLink from "@/components/social-link";
import { Logo, XIcon } from "@/components/shared/icons";
import { usePathname } from "next/navigation";

const FooterSection = () => {
    const t = useTranslations("Home");
    const pathname = usePathname();

    if (pathname.includes("/chat")) return null;

    return (
        <>
            <footer className="w-full border-t border-gray-200 dark:border-slate-800 dark:bg-neutral-900">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5 md:py-12 py-8">
                        <div className="col-span-full lg:col-span-1">
                            <a
                                href="/"
                                className="font-bold text-lg flex items-center"
                            >
                                {siteConfig.name}
                            </a>
                            <p className="leading-relaxed mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                                {t("footer.title")}
                            </p>
                        </div>

                        {footerNavs.map((item, idx) => (
                            <section key={idx} className="col-span-1">
                                <div className="font-bold text-neutral-800 dark:text-neutral-200">
                                    {item.label}
                                </div>
                                <ul className="mt-3 grid space-y-3">
                                    {item.items.map((el: any, idx: number) => (
                                        <li key={idx}>
                                            <a
                                                href={el.href}
                                                title={el.title}
                                                className="inline-flex gap-x-2 rounded-lg text-neutral-600 outline-none ring-zinc-500 transition duration-300 hover:text-neutral-500 focus-visible:ring dark:text-neutral-400 dark:ring-zinc-200 dark:hover:text-neutral-300 dark:focus:outline-none"
                                                rel="nofollow"
                                            >
                                                {el.content || el.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        ))}
                    </div>

                    <div className="md:py-8 py-6 grid gap-y-2 sm:flex sm:items-center sm:justify-between sm:gap-y-0">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                © 2024 {siteConfig.domain} All rights reserved.
                            </p>
                        </div>

                        <div>
                            <SocialLink url="https://x.com/candytools118">
                                <XIcon className="h-4 w-4 flex-shrink-0 fill-current text-neutral-700 dark:text-neutral-400" />
                            </SocialLink>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default FooterSection;
