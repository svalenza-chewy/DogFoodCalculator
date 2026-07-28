from __future__ import annotations

import html
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "18-month-cx-seo-roadmap.md"
OUTPUT_DIR = ROOT / "output" / "confluence"
PUBLIC_DIR = ROOT / "public" / "confluence"
MARKDOWN_OUTPUT = OUTPUT_DIR / "chewy-dog-food-finder-18-month-cx-seo-roadmap-confluence.md"
HTML_OUTPUT = OUTPUT_DIR / "chewy-dog-food-finder-18-month-cx-seo-roadmap-confluence.html"
PUBLIC_HTML_OUTPUT = PUBLIC_DIR / "chewy-dog-food-finder-18-month-cx-seo-roadmap.html"

PHASE_ROWS = [
    (
        "1. Foundation and alpha",
        "Oct 1-Dec 31, 2026",
        "Approved MVP requirements and usable internal alpha.",
        "Indexability, IA, analytics, and technical SEO guardrails.",
    ),
    (
        "2. MVP build and beta",
        "Jan 1-Mar 31, 2027",
        "Beta-quality finder connected to shopping and support paths.",
        "First crawlable content surfaces and structured data QA.",
    ),
    (
        "3. Public MVP and learning loop",
        "Apr 1-Jun 30, 2027",
        "Measured launch with feedback, transition, and Autoship signals.",
        "First durable SEO cluster with Search Console measurement.",
    ),
    (
        "4. Scale personalization and coverage",
        "Jul 1-Sep 30, 2027",
        "Pet Profile and lifecycle-triggered recalculation.",
        "Expanded content clusters without thin programmatic pages.",
    ),
    (
        "5. Optimization and integration",
        "Oct 1-Dec 31, 2027",
        "Recommendations surface across PDP, PLP, account, and CRM.",
        "Metadata, linking, Merchant Center, and content refresh optimization.",
    ),
    (
        "6. Maturity and new growth",
        "Jan 1-Mar 31, 2028",
        "Durable dog nutrition decision-support platform.",
        "Defensible organic growth model and adjacent expansion plan.",
    ),
]


def clean_text(value: str) -> str:
    replacements = {
        "\u2013": "-",
        "\u2014": "-",
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
        "\u00a0": " ",
    }
    for src, dest in replacements.items():
        value = value.replace(src, dest)
    return value


def roadmap_table_markdown() -> str:
    lines = [
        "## Roadmap At A Glance",
        "",
        "| Phase | Timing | Primary CX outcome | Primary SEO outcome |",
        "| --- | --- | --- | --- |",
    ]
    for phase, timing, cx, seo in PHASE_ROWS:
        lines.append(f"| {phase} | {timing} | {cx} | {seo} |")
    return "\n".join(lines)


def build_confluence_markdown(source: str) -> str:
    source = clean_text(source).strip()
    anchor = "## Product Vision"
    table = roadmap_table_markdown()
    if table in source:
        return source + "\n"
    if anchor in source:
        return source.replace(anchor, f"{table}\n\n{anchor}", 1) + "\n"
    return f"{source}\n\n{table}\n"


def inline_html(value: str) -> str:
    placeholders: list[tuple[str, str]] = []

    def stash_link(match: re.Match[str]) -> str:
        label = html.escape(clean_text(match.group(1)))
        href = html.escape(match.group(2), quote=True)
        token = f"@@LINK{len(placeholders)}@@"
        placeholders.append((token, f'<a href="{href}">{label}</a>'))
        return token

    def stash_code(match: re.Match[str]) -> str:
        token = f"@@CODE{len(placeholders)}@@"
        text = html.escape(clean_text(match.group(1)))
        placeholders.append((token, f"<code>{text}</code>"))
        return token

    value = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", stash_link, value)
    value = re.sub(r"`([^`]+)`", stash_code, value)
    value = html.escape(clean_text(value))
    value = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", value)
    for token, replacement in placeholders:
        value = value.replace(token, replacement)
    return value


def is_table_line(line: str) -> bool:
    return line.startswith("|") and line.endswith("|")


def split_table_row(line: str) -> list[str]:
    return [cell.strip() for cell in line.strip("|").split("|")]


def table_to_html(lines: list[str]) -> str:
    rows = [split_table_row(line) for line in lines if not re.match(r"^\|\s*[-: ]+\|", line)]
    if not rows:
        return ""
    header = rows[0]
    body_rows = rows[1:]
    thead = "<thead><tr>" + "".join(f"<th>{inline_html(cell)}</th>" for cell in header) + "</tr></thead>"
    tbody_parts = []
    for row in body_rows:
        tbody_parts.append("<tr>" + "".join(f"<td>{inline_html(cell)}</td>" for cell in row) + "</tr>")
    return "<table>" + thead + "<tbody>" + "".join(tbody_parts) + "</tbody></table>"


def flush_list(html_parts: list[str], list_items: list[str], ordered: bool) -> None:
    if not list_items:
        return
    tag = "ol" if ordered else "ul"
    html_parts.append(f"<{tag}>")
    html_parts.extend(f"<li>{inline_html(item)}</li>" for item in list_items)
    html_parts.append(f"</{tag}>")
    list_items.clear()


def markdown_to_html(markdown: str) -> str:
    html_parts: list[str] = []
    list_items: list[str] = []
    table_lines: list[str] = []
    ordered = False

    for raw in markdown.splitlines():
        line = clean_text(raw.rstrip())
        stripped = line.strip()

        if table_lines and (not stripped or not is_table_line(stripped)):
            html_parts.append(table_to_html(table_lines))
            table_lines.clear()

        if not stripped:
            flush_list(html_parts, list_items, ordered)
            continue

        if is_table_line(stripped):
            flush_list(html_parts, list_items, ordered)
            table_lines.append(stripped)
            continue

        heading_match = re.match(r"^(#{1,6})\s+(.*)$", stripped)
        bullet_match = re.match(r"^-\s+(.*)$", stripped)
        ordered_match = re.match(r"^\d+\.\s+(.*)$", stripped)

        if heading_match:
            flush_list(html_parts, list_items, ordered)
            level = len(heading_match.group(1))
            text = inline_html(heading_match.group(2))
            html_parts.append(f"<h{level}>{text}</h{level}>")
            continue

        if bullet_match:
            if list_items and ordered:
                flush_list(html_parts, list_items, ordered)
            ordered = False
            list_items.append(bullet_match.group(1))
            continue

        if ordered_match:
            if list_items and not ordered:
                flush_list(html_parts, list_items, ordered)
            ordered = True
            list_items.append(ordered_match.group(1))
            continue

        flush_list(html_parts, list_items, ordered)
        html_parts.append(f"<p>{inline_html(stripped)}</p>")

    if table_lines:
        html_parts.append(table_to_html(table_lines))
    flush_list(html_parts, list_items, ordered)
    return "\n".join(html_parts)


def html_document(body: str) -> str:
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>18-Month Roadmap: Chewy Dog Food Finder CX + SEO</title>
  <style>
    body {{
      background: #f6f8fc;
      color: #1a1a1a;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.45;
      margin: 0;
    }}
    .copy-toolbar {{
      align-items: center;
      background: #1c49c2;
      color: #ffffff;
      display: flex;
      gap: 16px;
      justify-content: space-between;
      padding: 14px 24px;
      position: sticky;
      top: 0;
      z-index: 1;
    }}
    .copy-toolbar p {{
      margin: 0;
    }}
    .copy-toolbar button {{
      background: #ffffff;
      border: 0;
      border-radius: 6px;
      color: #163aa0;
      cursor: pointer;
      font-weight: 700;
      padding: 9px 14px;
    }}
    .copy-toolbar button:focus {{
      outline: 3px solid #f25f3a;
      outline-offset: 2px;
    }}
    .copy-toolbar span {{
      min-width: 96px;
    }}
    main {{
      background: #ffffff;
      margin: 32px auto 56px;
      max-width: 980px;
      padding: 40px 48px 56px;
    }}
    h1, h2, h3, h4 {{
      color: #163aa0;
      line-height: 1.2;
      margin: 1.45em 0 0.45em;
    }}
    h1 {{ font-size: 32px; margin-top: 0; }}
    h2 {{ border-bottom: 1px solid #d9e0ec; font-size: 24px; padding-bottom: 8px; }}
    h3 {{ color: #1c49c2; font-size: 18px; }}
    h4 {{ color: #1a1a1a; font-size: 16px; }}
    p {{ margin: 0 0 12px; }}
    ul, ol {{ margin: 0 0 16px 24px; padding: 0; }}
    li {{ margin: 6px 0; }}
    table {{
      border-collapse: collapse;
      margin: 16px 0 24px;
      width: 100%;
    }}
    th {{
      background: #1c49c2;
      color: #ffffff;
      font-weight: 700;
      text-align: left;
    }}
    th, td {{
      border: 1px solid #d9e0ec;
      padding: 9px 10px;
      vertical-align: top;
    }}
    tr:nth-child(even) td {{ background: #f6f8fc; }}
    a {{ color: #1c49c2; }}
    code {{
      background: #f6f8fc;
      border: 1px solid #d9e0ec;
      border-radius: 4px;
      color: #1a1a1a;
      font-family: Consolas, Monaco, monospace;
      padding: 1px 4px;
    }}
    @media (max-width: 720px) {{
      .copy-toolbar {{
        align-items: flex-start;
        flex-direction: column;
      }}
      main {{
        margin: 0;
        padding: 28px 20px 48px;
      }}
    }}
  </style>
</head>
<body>
  <div class="copy-toolbar">
    <p><strong>Confluence-ready roadmap</strong></p>
    <button id="copy-button" type="button">Copy for Confluence</button>
    <span id="copy-status" aria-live="polite"></span>
  </div>
  <main id="confluence-content">
{body}
  </main>
  <script>
    const button = document.getElementById("copy-button");
    const status = document.getElementById("copy-status");
    const content = document.getElementById("confluence-content");

    async function copyContent() {{
      const html = content.innerHTML;
      const text = content.innerText;
      if (navigator.clipboard && window.ClipboardItem) {{
        await navigator.clipboard.write([
          new ClipboardItem({{
            "text/html": new Blob([html], {{ type: "text/html" }}),
            "text/plain": new Blob([text], {{ type: "text/plain" }})
          }})
        ]);
      }} else {{
        const range = document.createRange();
        range.selectNodeContents(content);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("copy");
        selection.removeAllRanges();
      }}
      status.textContent = "Copied";
      window.setTimeout(() => {{
        status.textContent = "";
      }}, 2200);
    }}

    button.addEventListener("click", () => {{
      copyContent().catch(() => {{
        status.textContent = "Select page text";
      }});
    }});
  </script>
</body>
</html>
"""


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    confluence_markdown = build_confluence_markdown(SOURCE.read_text(encoding="utf-8"))
    confluence_html = html_document(markdown_to_html(confluence_markdown))
    MARKDOWN_OUTPUT.write_text(confluence_markdown, encoding="utf-8")
    HTML_OUTPUT.write_text(confluence_html, encoding="utf-8")
    PUBLIC_HTML_OUTPUT.write_text(confluence_html, encoding="utf-8")
    print(MARKDOWN_OUTPUT)
    print(HTML_OUTPUT)
    print(PUBLIC_HTML_OUTPUT)


if __name__ == "__main__":
    main()
