import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MessageCodeBlock } from "@/components/chat/message-codeblock";
import "@/styles/markdown.css"

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
    const preprocessMarkdown = (markdownText: string) => {
        // Replace \[ with $$ and \] with $$ to ensure compatibility
        const processedText = markdownText
          .replace(/\\\[/g, '$$$')  // Replace all occurrences of \[ with $$
          .replace(/\\\]/g, '$$$') // Replace all occurrences of \] with $$
          .replace(/\\\(/g, '$$$')  // Replace all occurrences of \( with $$
          .replace(/\\\)/g, '$$$'); // Replace all occurrences of \) with $$
        
        return processedText;
    };      
    
    const components = {
        code({ node, className, children, ...props }: any) {
            const childArray = React.Children.toArray(children);
            const firstChild = childArray[0] as React.ReactElement;
            const firstChildAsString = React.isValidElement(firstChild)
                ? (firstChild as React.ReactElement).props.children
                : firstChild;

            if (firstChildAsString === "▍") {
                return (
                    <span className="mt-1 animate-pulse cursor-default">▍</span>
                );
            }

            if (typeof firstChildAsString === "string") {
                childArray[0] = firstChildAsString.replace("`▍`", "▍");
            }

            const match = /language-(\w+)/.exec(className || "");

            if (
                typeof firstChildAsString === "string" &&
                !firstChildAsString.includes("\n")
            ) {
                return (
                    <code className={className} {...props}>
                        {childArray}
                    </code>
                );
            }

            return (
                <MessageCodeBlock
                    key={Math.random()}
                    language={(match && match[1]) || ""}
                    value={String(childArray).replace(/\n$/, "")}
                    {...props}
                />
            );
        },
        ol: ({ node, children, ...props }: any) => {
            return (
                <ol className="list-decimal list-outside ml-4" {...props}>
                    {children}
                </ol>
            );
        },
        li: ({ node, children, ...props }: any) => {
            return (
                <li className="py-1" {...props}>
                    {children}
                </li>
            );
        },
        ul: ({ node, children, ...props }: any) => {
            return (
                <ul className="list-decimal list-outside ml-4" {...props}>
                    {children}
                </ul>
            );
        },
        strong: ({ node, children, ...props }: any) => {
            return (
                <span className="font-semibold" {...props}>
                    {children}
                </span>
            );
        },
        a: ({ node, children, ...props }: any) => {
            return (
                <a
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                    {...props}
                >
                    {children}
                </a>
            );
        },
        h1: ({ node, children, ...props }: any) => {
            return (
                <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
                    {children}
                </h1>
            );
        },
        h2: ({ node, children, ...props }: any) => {
            return (
                <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
                    {children}
                </h2>
            );
        },
        h3: ({ node, children, ...props }: any) => {
            return (
                <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
                    {children}
                </h3>
            );
        },
        h4: ({ node, children, ...props }: any) => {
            return (
                <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
                    {children}
                </h4>
            );
        },
        h5: ({ node, children, ...props }: any) => {
            return (
                <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
                    {children}
                </h5>
            );
        },
        h6: ({ node, children, ...props }: any) => {
            return (
                <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
                    {children}
                </h6>
            );
        },
    };

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="markdown-body min-w-full space-y-6 break-words"
            components={components}
        >
            {preprocessMarkdown(children)}
        </ReactMarkdown>
    );
};

export default memo(
    NonMemoizedMarkdown,
    (prevProps, nextProps) => prevProps.children === nextProps.children
);
