export function markdownToHtml(text: string): string {
  if (!text) return "";

  const lines = text.split("\n");
  const result: string[] = [];
  let inUl = false;
  let inOl = false;
  let inTable = false;
  let tableRows: string[] = [];
  let tableHeaderDone = false;

  const closeList = () => {
    if (inUl) { result.push("</ul>"); inUl = false; }
    if (inOl) { result.push("</ol>"); inOl = false; }
  };

  const flushTable = () => {
    if (!inTable) return;
    result.push('<table>');
    tableRows.forEach((row, i) => {
      const cells = row.split("|").map(c => c.trim()).filter(c => c !== "");
      if (i === 0) {
        result.push('<thead><tr>' + cells.map(c => `<th>${applyInline(c)}</th>`).join("") + '</tr></thead><tbody>');
      } else if (i === 1 && cells.every(c => /^[-:]+$/.test(c))) {
        // separator row — skip
      } else {
        result.push('<tr>' + cells.map(c => `<td>${applyInline(c)}</td>`).join("") + '</tr>');
      }
    });
    result.push('</tbody></table>');
    tableRows = [];
    inTable = false;
    tableHeaderDone = false;
  };

  const applyInline = (str: string): string => {
    // Bold + italic ***text***
    str = str.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
    // Bold **text**
    str = str.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    // Italic *text* or _text_
    str = str.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");
    str = str.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, "<em>$1</em>");
    // Inline code `code`
    str = str.replace(/`([^`]+)`/g, "<code>$1</code>");
    // Strikethrough ~~text~~
    str = str.replace(/~~(.+?)~~/g, "<del>$1</del>");
    return str;
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();

    // Table rows
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      closeList();
      if (!inTable) { inTable = true; tableRows = []; }
      tableRows.push(trimmed.slice(1, -1));
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Horizontal rule
    if (/^[-*_]{3,}$/.test(trimmed)) {
      closeList();
      result.push('<hr />');
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      closeList();
      result.push(`<blockquote>${applyInline(trimmed.slice(2))}</blockquote>`);
      continue;
    }

    // H4
    if (trimmed.startsWith("#### ")) {
      closeList();
      result.push(`<h4>${applyInline(trimmed.slice(5))}</h4>`);
      continue;
    }

    // H3
    if (trimmed.startsWith("### ")) {
      closeList();
      result.push(`<h3>${applyInline(trimmed.slice(4))}</h3>`);
      continue;
    }

    // H2
    if (trimmed.startsWith("## ")) {
      closeList();
      result.push(`<h2>${applyInline(trimmed.slice(3))}</h2>`);
      continue;
    }

    // H1
    if (trimmed.startsWith("# ")) {
      closeList();
      result.push(`<h1>${applyInline(trimmed.slice(2))}</h1>`);
      continue;
    }

    // Unordered list
    if (/^[-*•]\s+/.test(trimmed)) {
      if (inOl) { result.push("</ol>"); inOl = false; }
      if (!inUl) { result.push('<ul>'); inUl = true; }
      result.push(`<li>${applyInline(trimmed.replace(/^[-*•]\s+/, ""))}</li>`);
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(trimmed)) {
      if (inUl) { result.push("</ul>"); inUl = false; }
      if (!inOl) { result.push('<ol>'); inOl = true; }
      result.push(`<li>${applyInline(trimmed.replace(/^\d+\.\s+/, ""))}</li>`);
      continue;
    }

    // Empty line
    if (trimmed === "") {
      closeList();
      result.push("");
      continue;
    }

    // Paragraph
    closeList();
    result.push(`<p>${applyInline(trimmed)}</p>`);
  }

  // Close any open tags
  closeList();
  if (inTable) flushTable();

  return result.join("\n");
}
