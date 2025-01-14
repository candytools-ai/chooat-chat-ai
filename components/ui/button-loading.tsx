import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

export function ButtonLoading({
    children,
    loading = false,
    className = "",
    onClick = () => {},
    ...props
}: any) {
    const icon = typeof children === "string" ? false : true;

    return (
        <Button disabled={loading} onClick={onClick} {...props}>
            <>
                {loading ? (
                    <>
                        <LoaderCircle className="w-4 h-4 animate-spin mx-auto" />
                        {icon ? children[1] : children}
                    </>
                ) : (
                    <>{children}</>
                )}
            </>
        </Button>
    );
}
