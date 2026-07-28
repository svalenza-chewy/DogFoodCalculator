import type { ReactNode } from "react";
import { Check, Info, ShieldCheck, Stethoscope, TriangleAlert } from "lucide-react";
import type { DogFoodProduct, ProductRecommendation } from "../types";

type Tone = "default" | "success" | "warning" | "danger" | "soft";

export function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
  className = ""
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button className={`button button-${variant} ${className}`} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
  helper,
  error
}: {
  label: string;
  children: ReactNode;
  helper?: string;
  error?: string;
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {helper ? <span className="helper">{helper}</span> : null}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

export function OptionCard({
  title,
  description,
  selected,
  onClick,
  icon,
  disabled = false
}: {
  title: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  icon?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button className={`option-card ${selected ? "selected" : ""}`} type="button" onClick={onClick} disabled={disabled}>
      <span className="option-icon">{icon ?? <Check size={18} aria-hidden="true" />}</span>
      <span>
        <strong>{title}</strong>
        {description ? <small>{description}</small> : null}
      </span>
    </button>
  );
}

export function Chip({
  children,
  selected,
  onClick,
  disabled = false
}: {
  children: ReactNode;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button className={`chip ${selected ? "selected" : ""}`} type="button" onClick={onClick} disabled={disabled}>
      {selected ? <Check size={14} aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

export function Callout({
  children,
  tone = "soft",
  title,
  icon
}: {
  children: ReactNode;
  tone?: Tone;
  title?: string;
  icon?: ReactNode;
}) {
  const defaultIcon = tone === "warning" || tone === "danger" ? <TriangleAlert size={18} /> : <Info size={18} />;
  return (
    <div className={`callout callout-${tone}`} role={tone === "danger" || tone === "warning" ? "status" : undefined}>
      <span className="callout-icon" aria-hidden="true">
        {icon ?? defaultIcon}
      </span>
      <div>
        {title ? <strong>{title}</strong> : null}
        <div>{children}</div>
      </div>
    </div>
  );
}

export function ScoreRing({ score, label }: { score: number; label: string }) {
  return (
    <div
      className="score-ring"
      style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}
      aria-label={`${label}: ${score}%`}
    >
      <span>{score}</span>
      <small>{label}</small>
    </div>
  );
}

export function ProductArtwork({ product }: { product: DogFoodProduct }) {
  const initials = product.brand
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  return (
    <div
      className="product-art"
      style={
        {
          "--pack-primary": product.imagePalette.primary,
          "--pack-secondary": product.imagePalette.secondary,
          "--pack-accent": product.imagePalette.accent
        } as React.CSSProperties
      }
      aria-label={`${product.brand} ${product.name} product artwork placeholder`}
      role="img"
    >
      <div className={`product-pack product-pack-${product.format}`}>
        <div className="pack-tab" />
        <div className="pack-brand">{initials}</div>
        <div className="pack-bowl" />
        <div className="pack-protein">{product.primaryProtein}</div>
      </div>
    </div>
  );
}

export function TrustBadge({ recommendation }: { recommendation: ProductRecommendation }) {
  const { trustSignal } = recommendation;
  const Icon = trustSignal.tone === "warning" ? TriangleAlert : trustSignal.tone === "reviewed" ? ShieldCheck : Stethoscope;

  return (
    <div className={`trust-badge trust-${trustSignal.tone}`}>
      <Icon size={16} aria-hidden="true" />
      <div>
        <strong>{trustSignal.label}</strong>
        <span>{trustSignal.description}</span>
      </div>
    </div>
  );
}

export function MedicalDisclaimer() {
  return (
    <Callout tone="soft" title="Veterinary guidance">
      This tool provides general food recommendations based on the information provided and mocked product data. It does not
      diagnose health conditions or replace advice from your veterinarian.
    </Callout>
  );
}
