import { InputHTMLAttributes } from "react";
import "./Input.scss";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = ({ label, error, className = "", ...rest }: Props) => {
  return (
    <label className={`ui-input ${className}`}>
      {label && <span className="ui-input__label">{label}</span>}
      <input className="ui-input__field" {...rest} />
      {error && <span className="ui-input__error">{error}</span>}
    </label>
  );
};
