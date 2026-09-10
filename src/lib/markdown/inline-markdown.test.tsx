import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { escapeHtml, parseInlineMarkdown } from "./inline-markdown";
import { InlineMarkdown } from "./inline-markdown";

describe("inline markdown", () => {
  it("parses bold, italic, and links", () => {
    const tokens = parseInlineMarkdown("**bold** *italic* [link](https://example.com)");
    expect(tokens.some((t) => t.type === "bold")).toBe(true);
    expect(tokens.some((t) => t.type === "italic")).toBe(true);
    expect(tokens.some((t) => t.type === "link")).toBe(true);
  });

  it("escapes HTML", () => {
    expect(escapeHtml("<script>alert(1)</script>")).toBe(
      "&lt;script&gt;alert(1)&lt;/script&gt;",
    );
  });

  it("renders external links safely", () => {
    const html = renderToStaticMarkup(
      <InlineMarkdown text="See [docs](https://example.com)" />,
    );
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).not.toContain("<script>");
  });
});
