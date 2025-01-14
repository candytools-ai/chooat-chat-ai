import {
    Breadcrumb,
    // BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbProps {
    breadcrumbs: Array<{
        title: string;
        href?: string;
    }>;
}

export function Breadcrumbs({ breadcrumbs }: BreadcrumbProps) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {breadcrumbs.length > 1 && (
                    <>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={breadcrumbs[0].href}>
                                {breadcrumbs[0].title}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                    </>
                )}
                <BreadcrumbItem>
                    <BreadcrumbPage>{breadcrumbs[breadcrumbs.length > 1 ? 1 : 0].title}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}
