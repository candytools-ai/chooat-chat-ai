export const siteConfig: any = {
  name: "Chooat",
  url: process.env.NEXT_PUBLIC_URL,
  domain: process.env.NEXT_PUBLIC_DOMAIN,
};

export const defaultLocale = "en" as const;
export const languages = [
  { lang: "en", label: "English", hrefLang: "en-US" },
] as const;

export const locales = languages.map((lang) => lang.lang);

export const localePrefix: any = "as-needed";
export const localeDetection: boolean = false;