
import HeroSection from "@/components/marketing/hero";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: any) {
    const { locale } = await params;
    const t = await getTranslations("Home");

    return {
        title: t("Metadata.title"),
        description: t("Metadata.description"),
    };
}

export default async function IndexPage() {
    return (
        <main>
            <HeroSection />
        </main>
    );
}
