import { marked } from "marked";
import DOMPurify from "dompurify";
marked.setOptions({
  breaks: true,
  gfm: true,
});

export function useMarkdownParser() {
  const parse = (
    markdown: string,
    noteMap: Map<string, string> = new Map(),
  ): string => {
    let processed = markdown.replace(/\[\[([^\]]+)\]\]/g, (_match, title) => {
      const trimmed = title.trim();

      const lowerMap = new Map<string, string>();
      noteMap.forEach((id, t) => lowerMap.set(t.toLowerCase(), id));
      const id = noteMap.get(trimmed) ?? lowerMap.get(trimmed.toLowerCase());
      if (id) {
        return `<a class="wiki-link" href="/note/${id}" data-note-id="${id}">${trimmed}</a>`;
      }
      return `<a class="wiki-link wiki-link-missing" href="#" data-title="${trimmed}">${trimmed}</a>`;
    });

    const rawHtml = marked.parse(processed) as string;

    return DOMPurify.sanitize(rawHtml);
  };

  const extractLinks = (text: string): string[] => {
    const matches = text.matchAll(/\[\[([^\]]+)\]\]/g);
    return Array.from(matches).map((m) => m[1].trim());
  };

  return { parse, extractLinks };
}
