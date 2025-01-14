/* eslint-disable @next/next/no-img-element */
"use client";

import { AnimatePresence, motion } from "framer-motion";

import { useTranslations } from "next-intl";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MaxWidthWrapper from "../shared/max-width-wrapper";

const HeroSection = ({
    use,
    showBtn,
    showPic,
}: {
    use?: string;
    showBtn?: boolean;
    showPic?: boolean;
}) => {
    const t = useTranslations(use || "Home");

    return (
        <section className="relative md:-mt-[76px] not-prose">
            <div className="absolute inset-0 pointer-events-none"></div>
            <AnimatePresence>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="pt-0 md:pt-[76px] pointer-events-none"></div>
                    <div className="space-y-6 py-12 sm:py-20 lg:py-24">
                        <div className="container flex max-w-screen-md flex-col items-center gap-5 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 1 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    transition: {
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 30,
                                    },
                                }}
                            >
                                <h1
                                    id="transform-anim"
                                    className="text-balance font-satoshi text-[40px] font-black leading-[1.15] tracking-tight sm:text-5xl md:text-6xl md:leading-[1.15]"
                                >
                                    <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                        {t("Hero.colorTitle")}
                                    </span>{" "}
                                    {t("Hero.title")}
                                </h1>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 1 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    transition: {
                                        // delay: 0.3,
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 30,
                                    },
                                }}
                            >
                                <p
                                    id="transform-anim"
                                    className="max-w-2xl text-balance text-muted-foreground sm:text-lg"
                                >
                                    {t("Hero.description")}
                                </p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 1 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    transition: {
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 30,
                                    },
                                }}
                            >
                                <div className="flex justify-center space-x-2">
                                    <Link
                                        href="/chat"
                                        prefetch={true}
                                        className={cn(
                                            buttonVariants({
                                                rounded: "xl",
                                                size: "lg",
                                            }),
                                            "gap-2 px-5 text-[15px]"
                                        )}
                                    >
                                        <span>AI Chat</span>
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 1 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: {
                                // delay: 0.3,
                                type: "spring",
                                stiffness: 200,
                                damping: 30,
                            },
                        }}
                    >
                        <div className="pb-6 sm:pb-20">
                            <MaxWidthWrapper>
                                <div className="h-auto rounded-xl md:bg-muted/30 md:p-3.5 md:ring-1 md:ring-inset md:ring-border">
                                    <div className="relative overflow-hidden rounded-xl border md:rounded-lg">
                                        <img
                                            src="/hero-image-2.png"
                                            alt="ligth preview chooat landing"
                                            className="flex size-full object-contain object-center"
                                            width={1500}
                                            height={750}
                                        />
                                    </div>
                                </div>
                            </MaxWidthWrapper>
                        </div>
                    </motion.div>
                </div>
            </AnimatePresence>
        </section>
    );
};

export default HeroSection;
