import { FC, memo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface MessageCodeBlockProps {
    language: string;
    value: string;
}


export const MessageCodeBlock: FC<MessageCodeBlockProps> = memo(
    ({ language, value }) => {
        return (
            <>
                <div className="contain-inline-size rounded-md border border-1 border-border-medium relative bg-[#262626] font-sans">
                    {/* codeblock header */}
                    <div className="flex w-full items-center justify-between bg-[#2f2f2f] text-xs text-[#b4b4b4] px-4 rounded-t-md select-none py-2.5">
                        <span className="text-xs lowercase">{language}</span>
                    </div>
                    {/* codeblock content */}
                    <SyntaxHighlighter
                        language={language}
                        style={oneDark}
                        customStyle={{
                            margin: 0,
                            width: "100%",
                            borderRadius: 0,
                            background: "transparent",
                        }}
                        codeTagProps={{
                            style: {
                                fontSize: "14px",
                                fontFamily: "var(--font-mono)",
                            },
                        }}
                    >
                        {value}
                    </SyntaxHighlighter>
                </div>
            </>
        );
    }
);

MessageCodeBlock.displayName = "MessageCodeBlock";
