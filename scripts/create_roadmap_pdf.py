from __future__ import annotations

import html
import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    FrameBreak,
    HRFlowable,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "18-month-cx-seo-roadmap.md"
OUTPUT = ROOT / "output" / "pdf" / "chewy-dog-food-finder-18-month-cx-seo-roadmap.pdf"

CHEWY_BLUE = colors.HexColor("#1C49C2")
CHEWY_BLUE_DARK = colors.HexColor("#163AA0")
CHEWY_ORANGE = colors.HexColor("#F25F3A")
CHEWY_GREEN = colors.HexColor("#2E7D32")
SURFACE_SOFT = colors.HexColor("#F6F8FC")
TEXT_PRIMARY = colors.HexColor("#1A1A1A")
TEXT_SECONDARY = colors.HexColor("#5F6B7A")
LINE = colors.HexColor("#D9E0EC")


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


def inline_markup(value: str) -> str:
    placeholders: list[tuple[str, str]] = []

    def stash_link(match: re.Match[str]) -> str:
        label = html.escape(clean_text(match.group(1)))
        href = html.escape(match.group(2), quote=True)
        token = f"@@LINK{len(placeholders)}@@"
        placeholders.append((token, f'<a href="{href}" color="#1C49C2"><u>{label}</u></a>'))
        return token

    def stash_code(match: re.Match[str]) -> str:
        token = f"@@CODE{len(placeholders)}@@"
        text = html.escape(clean_text(match.group(1)))
        placeholders.append((token, f'<font name="Courier" size="8.5">{text}</font>'))
        return token

    value = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", stash_link, value)
    value = re.sub(r"`([^`]+)`", stash_code, value)
    value = html.escape(clean_text(value))
    value = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", value)
    for token, replacement in placeholders:
        value = value.replace(token, replacement)
    return value


def make_styles():
    base = getSampleStyleSheet()
    styles = {
        "title": ParagraphStyle(
            "RoadmapTitle",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=30,
            leading=34,
            textColor=colors.white,
            alignment=TA_LEFT,
            spaceAfter=14,
        ),
        "subtitle": ParagraphStyle(
            "RoadmapSubtitle",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=12,
            leading=17,
            textColor=colors.white,
            spaceAfter=10,
        ),
        "eyebrow": ParagraphStyle(
            "Eyebrow",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=8.5,
            leading=10,
            textColor=CHEWY_ORANGE,
            uppercase=True,
            spaceAfter=8,
        ),
        "h1": ParagraphStyle(
            "H1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=20,
            leading=25,
            textColor=CHEWY_BLUE_DARK,
            spaceBefore=18,
            spaceAfter=10,
            keepWithNext=True,
        ),
        "h2": ParagraphStyle(
            "H2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=15,
            leading=19,
            textColor=CHEWY_BLUE,
            spaceBefore=14,
            spaceAfter=8,
            keepWithNext=True,
        ),
        "h3": ParagraphStyle(
            "H3",
            parent=base["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=11.5,
            leading=15,
            textColor=TEXT_PRIMARY,
            spaceBefore=10,
            spaceAfter=5,
            keepWithNext=True,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.4,
            leading=13.2,
            textColor=TEXT_PRIMARY,
            spaceAfter=6,
        ),
        "small": ParagraphStyle(
            "Small",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8.2,
            leading=11,
            textColor=TEXT_SECONDARY,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.2,
            leading=12.8,
            textColor=TEXT_PRIMARY,
            leftIndent=8,
            spaceAfter=3,
        ),
        "table_header": ParagraphStyle(
            "TableHeader",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=8.8,
            leading=11,
            textColor=colors.white,
            alignment=TA_LEFT,
        ),
        "table_cell": ParagraphStyle(
            "TableCell",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8,
            leading=10.5,
            textColor=TEXT_PRIMARY,
        ),
        "metric": ParagraphStyle(
            "Metric",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=10,
            leading=13,
            textColor=colors.white,
            alignment=TA_CENTER,
        ),
    }
    return styles


def paragraph(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(inline_markup(text), style)


def make_cover(styles):
    title = "18-Month Roadmap: Chewy Dog Food Finder CX + SEO"
    rows = [
        [paragraph("Prepared for", styles["table_header"]), paragraph("Incoming product manager", styles["table_cell"])],
        [paragraph("PM start date", styles["table_header"]), paragraph("Thursday, October 1, 2026", styles["table_cell"])],
        [paragraph("Roadmap window", styles["table_header"]), paragraph("October 1, 2026 - March 31, 2028", styles["table_cell"])],
        [paragraph("Focus", styles["table_header"]), paragraph("Customer experience, SEO, commerce, retention, and veterinary trust", styles["table_cell"])],
    ]
    meta = Table(rows, colWidths=[1.5 * inch, 4.25 * inch], hAlign="LEFT")
    meta.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), CHEWY_BLUE),
                ("BACKGROUND", (1, 0), (1, -1), colors.white),
                ("BOX", (0, 0), (-1, -1), 0.8, colors.white),
                ("INNERGRID", (0, 0), (-1, -1), 0.4, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 9),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )

    return [
        Spacer(1, 0.35 * inch),
        Paragraph("CHEWY DOG FOOD FINDER", styles["eyebrow"]),
        Paragraph(title, styles["title"]),
        Paragraph(
            "A product roadmap for transforming the current prototype into a governed recommendation experience and an organic-growth platform.",
            styles["subtitle"],
        ),
        Spacer(1, 0.28 * inch),
        meta,
        Spacer(1, 0.38 * inch),
        Table(
            [
                [
                    Paragraph("CX", styles["metric"]),
                    Paragraph("SEO", styles["metric"]),
                    Paragraph("Trust", styles["metric"]),
                    Paragraph("Commerce", styles["metric"]),
                ],
                [
                    paragraph("Guided choices with clear next steps.", styles["small"]),
                    paragraph("Indexable education and shopping paths.", styles["small"]),
                    paragraph("Veterinary safeguards and claim governance.", styles["small"]),
                    paragraph("PDP, PLP, Autoship, and retention integration.", styles["small"]),
                ],
            ],
            colWidths=[1.38 * inch] * 4,
            hAlign="LEFT",
            style=TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), CHEWY_ORANGE),
                    ("BACKGROUND", (0, 1), (-1, 1), colors.white),
                    ("BOX", (0, 0), (-1, -1), 0.8, colors.white),
                    ("INNERGRID", (0, 0), (-1, -1), 0.4, LINE),
                    ("LEFTPADDING", (0, 0), (-1, -1), 9),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                    ("TOPPADDING", (0, 0), (-1, -1), 9),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ]
            ),
        ),
        PageBreak(),
    ]


def roadmap_table(styles):
    data = [
        [
            Paragraph("Phase", styles["table_header"]),
            Paragraph("Timing", styles["table_header"]),
            Paragraph("Primary CX outcome", styles["table_header"]),
            Paragraph("Primary SEO outcome", styles["table_header"]),
        ],
        [
            paragraph("1. Foundation and alpha", styles["table_cell"]),
            paragraph("Oct 1 - Dec 31, 2026", styles["table_cell"]),
            paragraph("Approved MVP requirements and usable internal alpha.", styles["table_cell"]),
            paragraph("Indexability, IA, analytics, and technical SEO guardrails.", styles["table_cell"]),
        ],
        [
            paragraph("2. MVP build and beta", styles["table_cell"]),
            paragraph("Jan 1 - Mar 31, 2027", styles["table_cell"]),
            paragraph("Beta-quality finder connected to shopping and support paths.", styles["table_cell"]),
            paragraph("First crawlable content surfaces and structured data QA.", styles["table_cell"]),
        ],
        [
            paragraph("3. Public MVP and learning loop", styles["table_cell"]),
            paragraph("Apr 1 - Jun 30, 2027", styles["table_cell"]),
            paragraph("Measured launch with feedback, transition, and Autoship signals.", styles["table_cell"]),
            paragraph("First durable SEO cluster with Search Console measurement.", styles["table_cell"]),
        ],
        [
            paragraph("4. Scale personalization and coverage", styles["table_cell"]),
            paragraph("Jul 1 - Sep 30, 2027", styles["table_cell"]),
            paragraph("Pet Profile and lifecycle-triggered recalculation.", styles["table_cell"]),
            paragraph("Expanded content clusters without thin programmatic pages.", styles["table_cell"]),
        ],
        [
            paragraph("5. Optimization and integration", styles["table_cell"]),
            paragraph("Oct 1 - Dec 31, 2027", styles["table_cell"]),
            paragraph("Recommendations surface across PDP, PLP, account, and CRM.", styles["table_cell"]),
            paragraph("Metadata, linking, Merchant Center, and content refresh optimization.", styles["table_cell"]),
        ],
        [
            paragraph("6. Maturity and new growth", styles["table_cell"]),
            paragraph("Jan 1 - Mar 31, 2028", styles["table_cell"]),
            paragraph("Durable dog nutrition decision-support platform.", styles["table_cell"]),
            paragraph("Defensible organic growth model and adjacent expansion plan.", styles["table_cell"]),
        ],
    ]
    table = Table(data, colWidths=[1.35 * inch, 1.25 * inch, 2.1 * inch, 2.1 * inch], repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), CHEWY_BLUE),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, SURFACE_SOFT]),
                ("GRID", (0, 0), (-1, -1), 0.35, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    return [Paragraph("Roadmap At A Glance", styles["h1"]), table, PageBreak()]


def flush_list(story, items, ordered, styles):
    if not items:
        return
    flow_items = [ListItem(paragraph(item, styles["bullet"]), leftIndent=10) for item in items]
    story.append(
        ListFlowable(
            flow_items,
            bulletType="1" if ordered else "bullet",
            start="1" if ordered else None,
            leftIndent=16,
            bulletFontName="Helvetica-Bold",
            bulletFontSize=8.5,
            bulletColor=CHEWY_BLUE,
        )
    )
    story.append(Spacer(1, 4))


def markdown_to_story(markdown: str, styles):
    story = []
    list_items: list[str] = []
    ordered = False
    page_break_before = {
        "30/60/90-Day Plan",
        "18-Month Roadmap",
        "Workstream Backlog",
        "Decision Log To Create",
        "Key Risks",
        "Next 10 PM Actions",
    }

    lines = markdown.splitlines()
    skip_title = True

    for raw in lines:
        line = clean_text(raw.rstrip())
        stripped = line.strip()

        if not stripped:
            flush_list(story, list_items, ordered, styles)
            list_items = []
            story.append(Spacer(1, 4))
            continue

        heading_match = re.match(r"^(#{1,4})\s+(.*)$", stripped)
        bullet_match = re.match(r"^-\s+(.*)$", stripped)
        ordered_match = re.match(r"^\d+\.\s+(.*)$", stripped)

        if heading_match:
            flush_list(story, list_items, ordered, styles)
            list_items = []
            level = len(heading_match.group(1))
            text = heading_match.group(2)
            if skip_title and level == 1:
                skip_title = False
                continue
            phase_break = re.match(r"^Phase [2-6]:", text)
            if text in page_break_before or phase_break:
                if story and not isinstance(story[-1], PageBreak):
                    story.append(PageBreak())
            style = styles["h1"] if level == 2 else styles["h2"] if level == 3 else styles["h3"]
            story.append(paragraph(text, style))
            if level == 2:
                story.append(HRFlowable(width="100%", thickness=0.7, color=LINE, spaceBefore=0, spaceAfter=8))
            continue

        skip_title = False

        if bullet_match:
            if list_items and ordered:
                flush_list(story, list_items, ordered, styles)
                list_items = []
            ordered = False
            list_items.append(bullet_match.group(1))
            continue

        if ordered_match:
            if list_items and not ordered:
                flush_list(story, list_items, ordered, styles)
                list_items = []
            ordered = True
            list_items.append(ordered_match.group(1))
            continue

        flush_list(story, list_items, ordered, styles)
        list_items = []

        if stripped.endswith(":") and len(stripped) < 70:
            story.append(paragraph(stripped, styles["h3"]))
        else:
            story.append(paragraph(stripped, styles["body"]))

    flush_list(story, list_items, ordered, styles)
    return story


def page_background(canvas, doc):
    canvas.saveState()
    width, height = letter
    if doc.page == 1:
        canvas.setFillColor(CHEWY_BLUE)
        canvas.rect(0, 0, width, height, fill=1, stroke=0)
        canvas.setFillColor(CHEWY_BLUE_DARK)
        canvas.circle(width + 0.15 * inch, height - 1.1 * inch, 2.2 * inch, fill=1, stroke=0)
        canvas.setFillColor(CHEWY_ORANGE)
        canvas.circle(width - 0.9 * inch, 0.6 * inch, 1.35 * inch, fill=1, stroke=0)
        canvas.setFillColor(colors.white)
        canvas.setFont("Helvetica-Bold", 9)
        canvas.drawString(0.65 * inch, 0.55 * inch, "Chewy Dog Food Finder")
    else:
        canvas.setFillColor(colors.white)
        canvas.rect(0, 0, width, height, fill=1, stroke=0)
        canvas.setFillColor(CHEWY_BLUE)
        canvas.rect(0, height - 0.34 * inch, width, 0.34 * inch, fill=1, stroke=0)
        canvas.setFont("Helvetica-Bold", 8)
        canvas.setFillColor(colors.white)
        canvas.drawString(0.58 * inch, height - 0.22 * inch, "Chewy Dog Food Finder - 18-Month CX + SEO Roadmap")
        canvas.setFillColor(TEXT_SECONDARY)
        canvas.setFont("Helvetica", 8)
        canvas.drawString(0.58 * inch, 0.36 * inch, "Prepared for PM onboarding - roadmap window: Oct 1, 2026 - Mar 31, 2028")
        canvas.drawRightString(width - 0.58 * inch, 0.36 * inch, f"Page {doc.page}")
    canvas.restoreState()


def build_pdf():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    styles = make_styles()
    markdown = SOURCE.read_text(encoding="utf-8")

    story = []
    story.extend(make_cover(styles))
    story.extend(roadmap_table(styles))
    story.extend(markdown_to_story(markdown, styles))

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        leftMargin=0.58 * inch,
        rightMargin=0.58 * inch,
        topMargin=0.62 * inch,
        bottomMargin=0.65 * inch,
        title="18-Month Roadmap: Chewy Dog Food Finder CX + SEO",
        author="Codex",
        subject="Customer experience and SEO roadmap",
    )
    doc.build(story, onFirstPage=page_background, onLaterPages=page_background)
    return OUTPUT


if __name__ == "__main__":
    print(build_pdf())
