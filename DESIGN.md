---
name: Chewy Dog Food Finder Prototype
version: "0.1"
source: Chewy DESIGN.md skill guidance fetched from local skill repo on 2026-07-10
colors:
  primary: "#1C49C2"
  on-primary: "#FFFFFF"
  accent: "#F25F3A"
  on-accent: "#FFFFFF"
  success: "#2E7D32"
  warning: "#ED6C02"
  error: "#D32F2F"
  surface: "#FFFFFF"
  surface-soft: "#F6F8FC"
  text-primary: "#1A1A1A"
  text-secondary: "#5F6B7A"
typography:
  display:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 2.5rem
    fontWeight: 600
    lineHeight: 1.2
  headline:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 1.75rem
    fontWeight: 600
    lineHeight: 1.3
  title:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 1.25rem
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.4
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
rounded:
  sm: 6px
  md: 12px
  lg: 16px
---

## Product Direction

This prototype applies the Chewy DESIGN.md principles: clear, warm, practical, trustworthy, emotionally aware, and accessible. It is customer-facing, but the interaction avoids unsupported medical claims and keeps the next action obvious.

## Application Guidance

- Use semantic color roles in CSS variables instead of one-off colors.
- Use primary blue for main actions, accent orange sparingly for commerce moments, green for positive status, and warning/error colors only with matching text.
- Keep questionnaire steps conversational and scannable.
- Use reassurance callouts for uncertainty, especially allergy, prescription diet, and therapeutic diet moments.
- Use cards only to group related form choices, product recommendations, repeated modules, and modals.
- Use visible tradeoffs in recommendations so the experience feels credible rather than promotional.
- Do not imply diagnosis, treatment, cure, or universal veterinarian endorsement.
- Keep veterinary labels precise: veterinarian-informed, reviewed by veterinary experts, veterinarian-recommended claim, or recommended by your veterinarian.
