import type { ReactNode } from "react";

type Token =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "italic"; value: string }
  | { type: "boldItalic"; value: string }
  | { type: "link"; label: string; href: string };

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function parseInlineMarkdown(text: string): Token[] {
  const tokens: Token[] = [];
  const pattern =
    /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    if (match[2]) tokens.push({ type: "boldItalic", value: match[2] });
    else if (match[3]) tokens.push({ type: "bold", value: match[3] });
    else if (match[4]) tokens.push({ type: "italic", value: match[4] });
    else if (match[5] && match[6]) {
      tokens.push({ type: "link", label: match[5], href: match[6] });
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: "text", value: text.slice(lastIndex) });
  }

  return tokens;
}

export function InlineMarkdown({ text }: { text: string }) {
  const tokens = parseInlineMarkdown(text);
  const nodes: ReactNode[] = tokens.map((token, i) => {
    switch (token.type) {
      case "text":
        return <span key={i}>{token.value}</span>;
      case "bold":
        return <strong key={i}>{token.value}</strong>;
      case "italic":
        return <em key={i}>{token.value}</em>;
      case "boldItalic":
        return (
          <strong key={i}>
            <em>{token.value}</em>
          </strong>
        );
      case "link":
        return (
          <a
            key={i}
            href={token.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 underline hover:text-indigo-800"
          >
            {token.label}
          </a>
        );
      default:
        return null;
    }
  });

  return <>{nodes}</>;
}
