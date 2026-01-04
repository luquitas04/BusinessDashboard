import { SelectHTMLAttributes, ReactNode } from "react";
import "./Select.scss";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  children: ReactNode;
};

export const Select = ({ label, error, className = "", children, ...rest }: Props) => {
  return (
    <label className={`ui-select ${className}`}>
      {label && <span className="ui-select__label">{label}</span>}
      <select className="ui-select__field" {...rest}>
        {children}
      </select>
      {error && <span className="ui-select__error">{error}</span>}
    </label>
  );
};
