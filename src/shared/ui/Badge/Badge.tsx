import { ReactNode } from "react";
import "./Badge.scss";

type BadgeVariant = "success" | "warning" | "neutral" | "danger";

type Props = {
  children: ReactNode;
  variant?: BadgeVariant;
};

export const Badge = ({ children, variant = "neutral" }: Props) => {
  return <span className={`ui-badge ui-badge--${variant}`}>{children}</span>;
};
