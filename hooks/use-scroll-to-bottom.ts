import { Message } from "ai";
import { useEffect, useRef, RefObject } from "react";

export function useScrollToBottom<T extends HTMLElement>(messages: Array<Message>): [
  RefObject<T>,
  RefObject<T>,
] {
  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);

  useEffect(() => {
    if (messages.length <= 1) return;
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return [containerRef, endRef];
}
