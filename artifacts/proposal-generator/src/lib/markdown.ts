export function markdownToHtml(text: string): string {
  if (!text) return "";

  const lines = text.split("\n");
  const result: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Convert bold **text**
    line = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    // Convert italic *text*
    line = line.replace(/\*(.+?)\*/g, "<em>$1</em>");

    // Headings
    if (line.startsWith("### ")) {
      if (inList) { result.push("</ul>"); inList = false; }
      result.push(`<h3 class="text-lg font-serif font-semibold mt-5 mb-2">${line.slice(4)}</h3>`);
    } else if (line.startsWith("## ")) {
      if (inList) { result.push("</ul>"); inList = false; }
      result.push(`<h2 class="text-xl font-serif font-bold mt-6 mb-3">${line.slice(3)}</h2>`);
    } else if (line.startsWith("# ")) {
      if (inList) { result.push("</ul>"); inList = false; }
      result.push(`<h1 class="text-2xl font-serif font-bold mt-6 mb-3">${line.slice(2)}</h1>`);
    } else if (line.match(/^[-*•]\s+/)) {
      // List items
      if (!inList) { result.push('<ul class="list-disc pl-5 my-3 space-y-1">'); inList = true; }
      result.push(`<li class="font-serif leading-relaxed">${line.replace(/^[-*•]\s+/, "")}</li>`);
    } else if (line.match(/^\d+\.\s+/)) {
      // Numbered list items
      if (!inList) { result.push('<ol class="list-decimal pl-5 my-3 space-y-1">'); inList = true; }
      result.push(`<li class="font-serif leading-relaxed">${line.replace(/^\d+\.\s+/, "")}</li>`);
    } else if (line.trim() === "") {
      if (inList) { result.push("</ul>"); inList = false; }
      result.push("");
    } else {
      if (inList) { result.push("</ul>"); inList = false; }
      result.push(`<p class="font-serif leading-relaxed my-3">${line}</p>`);
    }
  }

  if (inList) result.push("</ul>");

  return result.join("\n");
}
