/** Normalize week labels from sessions or admin input into brief week keys. */
export function normalizeWeekKey(input: string): string | null {
  const text = input.trim();
  if (!text) return null;

  const lower = text.toLowerCase().replace(/[–—]/g, "-");

  if (lower.includes("capstone")) return "capstone";
  if (lower.includes("orientation") || lower === "0") return "orientation";

  const capstoneParen = lower.match(/w\s*(\d+)\s*-\s*(\d+)/);
  if (capstoneParen) return "capstone";

  const withLetter = lower.match(/(?:week\s*)?(\d+)\s*\(\s*a\s*\)/);
  if (withLetter) return `W${withLetter[1]}a`;

  const letterSuffix = lower.match(/(?:week\s*)?(\d+)\s*a\b/);
  if (letterSuffix) return `W${letterSuffix[1]}a`;

  const wk = lower.match(/(?:week\s*)?w\s*(\d+)\s*a\b/);
  if (wk) return `W${wk[1]}a`;

  const weekNum = lower.match(/(?:week\s*)?(\d+)\b/);
  if (weekNum) return `W${weekNum[1]}`;

  const bareW = lower.match(/^w(\d+)$/);
  if (bareW) return `W${bareW[1]}`;

  if (lower === "w8a" || lower === "8a" || lower === "8(a)") return "W8a";
  if (lower === "w9a" || lower === "9a" || lower === "9(a)") return "W9a";
  if (lower === "w5" || lower === "5") return "W5";

  return null;
}
