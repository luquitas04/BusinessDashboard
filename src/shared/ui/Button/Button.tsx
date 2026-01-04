import { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.scss";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
};

export const Button = ({
  variant = "primary",
  size = "md",
  leftIcon,
  children,
  className = "",
  ...rest
}: Props) => {
  return (
    <button
      className={`ui-button ui-button--${variant} ui-button--${size} ${className}`}
      {...rest}
    >
      {leftIcon && <span className="ui-button__icon">{leftIcon}</span>}
      <span>{children}</span>
    </button>
  );
};
