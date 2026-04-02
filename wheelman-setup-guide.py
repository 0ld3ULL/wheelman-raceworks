"""Generate Wheelman Raceworks customer setup guide PDF."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether,
)
from reportlab.pdfgen import canvas

# Brand colors
TEAL = HexColor("#3ec5c9")
ORANGE = HexColor("#f26522")
NAVY = HexColor("#050811")
DARK_BG = HexColor("#0a0e1a")
WHITE = HexColor("#ffffff")
LIGHT_GRAY = HexColor("#e5e7eb")
MID_GRAY = HexColor("#6b7280")
SOFT_BG = HexColor("#f3f4f6")

# Styles
style_title = ParagraphStyle(
    "Title",
    fontName="Helvetica-Bold",
    fontSize=28,
    leading=34,
    textColor=WHITE,
    alignment=TA_CENTER,
)
style_subtitle = ParagraphStyle(
    "Subtitle",
    fontName="Helvetica",
    fontSize=13,
    leading=18,
    textColor=TEAL,
    alignment=TA_CENTER,
)
style_h1 = ParagraphStyle(
    "H1",
    fontName="Helvetica-Bold",
    fontSize=20,
    leading=26,
    textColor=NAVY,
    spaceBefore=20,
    spaceAfter=8,
)
style_h2 = ParagraphStyle(
    "H2",
    fontName="Helvetica-Bold",
    fontSize=14,
    leading=20,
    textColor=TEAL,
    spaceBefore=16,
    spaceAfter=6,
)
style_body = ParagraphStyle(
    "Body",
    fontName="Helvetica",
    fontSize=11,
    leading=16,
    textColor=NAVY,
    spaceAfter=4,
)
style_step = ParagraphStyle(
    "Step",
    fontName="Helvetica",
    fontSize=11,
    leading=16,
    textColor=NAVY,
    leftIndent=8,
    spaceAfter=3,
)
style_note = ParagraphStyle(
    "Note",
    fontName="Helvetica-Oblique",
    fontSize=10,
    leading=14,
    textColor=MID_GRAY,
    leftIndent=8,
    spaceAfter=4,
)
style_cred = ParagraphStyle(
    "Cred",
    fontName="Courier-Bold",
    fontSize=12,
    leading=18,
    textColor=NAVY,
    leftIndent=16,
    spaceAfter=2,
)
style_footer = ParagraphStyle(
    "Footer",
    fontName="Helvetica",
    fontSize=8,
    leading=10,
    textColor=MID_GRAY,
    alignment=TA_CENTER,
)


class WheelmanDocTemplate(SimpleDocTemplate):
    def afterPage(self):
        """Draw footer on each page."""
        c = self.canv
        w, h = A4
        c.setFillColor(LIGHT_GRAY)
        c.rect(0, 0, w, 18 * mm, fill=1, stroke=0)
        c.setFillColor(MID_GRAY)
        c.setFont("Helvetica", 7)
        c.drawCentredString(w / 2, 8 * mm, "Wheelman Raceworks  |  wheelmanraceworks.com  |  Confidential")


def header_block():
    """Create the dark navy header banner."""
    # Use a colored table as the banner
    data = [[""]]
    t = Table(data, colWidths=[170 * mm], rowHeights=[55 * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), NAVY),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    return t


def teal_line():
    return HRFlowable(width="100%", thickness=2, color=TEAL, spaceBefore=4, spaceAfter=12)


def orange_line():
    return HRFlowable(width="100%", thickness=1, color=ORANGE, spaceBefore=2, spaceAfter=8)


def step(num, text):
    return Paragraph(
        f'<b><font color="#{ORANGE.hexval()[2:]}">{num}.</font></b>  {text}',
        style_step,
    )


def note(text):
    return Paragraph(text, style_note)


def section_box(elements):
    """Wrap elements in a light gray box."""
    inner = []
    for el in elements:
        inner.append(el)
    data = [[inner]]
    t = Table(data, colWidths=[160 * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), SOFT_BG),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return t


def build_pdf():
    output_path = "C:/Projects/Clawdbot/wheelman-setup-guide.pdf"

    doc = WheelmanDocTemplate(
        output_path,
        pagesize=A4,
        topMargin=15 * mm,
        bottomMargin=25 * mm,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
    )

    story = []

    # ── HEADER ──
    story.append(header_block())
    story.append(Spacer(1, -42 * mm))
    story.append(Paragraph("WHEELMAN RACEWORKS", style_title))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph("Setup Guide", style_subtitle))
    story.append(Spacer(1, 18 * mm))

    story.append(Paragraph(
        "This guide covers two things: setting up your email and accessing your admin dashboard.",
        style_body,
    ))
    story.append(Spacer(1, 4 * mm))

    # ═══════════════════════════════════════════════════════════════
    # SECTION 1 — EMAIL
    # ═══════════════════════════════════════════════════════════════
    story.append(Paragraph("1. Email Setup", style_h1))
    story.append(teal_line())
    story.append(Paragraph(
        "We're setting up <b>hello@wheelmanraceworks.com</b> to forward to your Gmail. "
        "Every email will arrive in Gmail with a <b>WHEELMAN</b> label so you can find them instantly.",
        style_body,
    ))
    story.append(Spacer(1, 4 * mm))

    # ── PART A ──
    story.append(Paragraph("Part A — Turn on Email Forwarding (Namecheap)", style_h2))
    story.append(orange_line())
    story.append(step(1, 'Go to <b>namecheap.com</b> and log in'))
    story.append(step(2, 'Click <b>Domain List</b> in the left sidebar'))
    story.append(step(3, 'Find <b>wheelmanraceworks.com</b> and click <b>Manage</b>'))
    story.append(step(4, 'Click the <b>Email</b> tab (not DNS, not Hosting)'))
    story.append(step(5, 'Under <b>Email Forwarding</b>, click <b>Add Forwarder</b>'))
    story.append(step(6, 'In the left box, type: <b>hello</b>'))
    story.append(step(7, 'In the right box, type: <b>your Gmail address</b>'))
    story.append(step(8, 'Click the <b>checkmark</b> to save'))
    story.append(step(9, 'Namecheap will send a verification email to your Gmail'))
    story.append(step(10, '<b>Open Gmail</b> and click the <b>verification link</b> in that email'))
    story.append(Spacer(1, 2 * mm))
    story.append(note(
        "After this, any email sent to hello@wheelmanraceworks.com will arrive in your Gmail inbox."
    ))
    story.append(Spacer(1, 6 * mm))

    # ── PART B ──
    story.append(Paragraph("Part B — Create a WHEELMAN Label in Gmail", style_h2))
    story.append(orange_line())
    story.append(step(1, 'Open <b>Gmail</b> on a computer (not your phone)'))
    story.append(step(2, 'Click the <b>gear icon</b> (top right corner) then click <b>See all settings</b>'))
    story.append(step(3, 'Click the <b>Filters and Blocked Addresses</b> tab'))
    story.append(step(4, 'Click <b>Create a new filter</b>'))
    story.append(step(5, 'In the <b>To</b> field, type: <b>hello@wheelmanraceworks.com</b>'))
    story.append(step(6, 'Click <b>Create filter</b>'))
    story.append(step(7, 'Tick the box: <b>Apply the label</b>'))
    story.append(step(8, 'Click <b>New label</b>, type <b>WHEELMAN</b>, click <b>Create</b>'))
    story.append(step(9, 'Also tick: <b>Also apply filter to matching conversations</b>'))
    story.append(step(10, 'Click <b>Create filter</b>'))
    story.append(Spacer(1, 2 * mm))
    story.append(note(
        'Now every Wheelman email gets a WHEELMAN label. Click it in your Gmail sidebar to see only those emails.'
    ))
    story.append(Spacer(1, 6 * mm))

    # ── PART C ──
    story.append(Paragraph("Part C — Replying as hello@wheelmanraceworks.com (Optional)", style_h2))
    story.append(orange_line())
    story.append(Paragraph(
        "Right now, when you reply to a customer email, they'll see your personal Gmail address. "
        "If you want replies to come from <b>hello@wheelmanraceworks.com</b> instead, you'll need "
        "a Namecheap Private Email plan (<b>$1.48/month</b>).",
        style_body,
    ))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "For now, most businesses just reply from Gmail and it works fine. "
        "We can set this up later if you want it.",
        style_body,
    ))
    story.append(Spacer(1, 10 * mm))

    # ═══════════════════════════════════════════════════════════════
    # SECTION 2 — ADMIN
    # ═══════════════════════════════════════════════════════════════
    story.append(Paragraph("2. Admin Dashboard", style_h1))
    story.append(teal_line())
    story.append(Paragraph(
        "Your admin dashboard lets you manage bookings, create events, and view site stats.",
        style_body,
    ))
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph("How to Log In", style_h2))
    story.append(orange_line())
    story.append(step(1, 'Go to <b>wheelmanraceworks.com</b> on a computer or phone'))
    story.append(step(2, 'Click <b>Login</b> (top right)'))
    story.append(step(3, 'Enter your credentials:'))
    story.append(Spacer(1, 3 * mm))

    # Credentials box
    cred_data = [
        [Paragraph('<font color="#6b7280">Email:</font>', style_body),
         Paragraph('<b>hello@wheelmanraceworks.com</b>', style_cred)],
        [Paragraph('<font color="#6b7280">Password:</font>', style_body),
         Paragraph('<b>WheelmanAdmin2026</b>', style_cred)],
    ]
    cred_table = Table(cred_data, colWidths=[30 * mm, 120 * mm])
    cred_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), SOFT_BG),
        ("BOX", (0, 0), (-1, -1), 1, TEAL),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(cred_table)
    story.append(Spacer(1, 4 * mm))

    story.append(step(4, 'Once logged in, go to <b>wheelmanraceworks.com/admin</b>'))
    story.append(Spacer(1, 6 * mm))

    story.append(Paragraph("What You Can Do", style_h2))
    story.append(orange_line())

    features = [
        ["Bookings", "View all booking requests. Confirm, cancel, or mark them as completed."],
        ["Events", "Create new events (competitions, lessons, meetups). Set date, time, capacity."],
        ["Stats", "See total users, bookings, upcoming events, and revenue at a glance."],
    ]
    for feat_name, feat_desc in features:
        story.append(Paragraph(
            f'<b><font color="#{TEAL.hexval()[2:]}">{feat_name}</font></b> \u2014 {feat_desc}',
            style_step,
        ))
    story.append(Spacer(1, 6 * mm))

    story.append(note(
        "Important: Please change your password after your first login. "
        "Let us know and we'll walk you through it."
    ))

    # ── Footer spacer ──
    story.append(Spacer(1, 15 * mm))
    story.append(HRFlowable(width="40%", thickness=1, color=LIGHT_GRAY, spaceBefore=0, spaceAfter=8))
    story.append(Paragraph(
        "Questions? Contact your web team. We're happy to help.",
        ParagraphStyle("center_body", parent=style_body, alignment=TA_CENTER, textColor=MID_GRAY, fontSize=10),
    ))

    doc.build(story)
    print(f"PDF saved to: {output_path}")


if __name__ == "__main__":
    build_pdf()
