declare module 'bcrypt';
declare module "mime-types";
declare module "next-intl";
declare module 'typography';
declare module 'react-typography';
declare module 'md5';

declare module globalThis {
  var prisma: any;
}

export type NavItem = {
  title: string;
  href: string;
  badge?: number;
  disabled?: boolean;
  external?: boolean;
  icon?: any;
};

export type SidebarNavItem = {
  title: string;
  items: NavItem[];
  icon?: any;
};