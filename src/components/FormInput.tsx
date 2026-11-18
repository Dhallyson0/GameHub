import type { InputHTMLAttributes } from "react";

import "../styles/ComponentFormInput.css";

// PROPS

type FormInputProps =
  InputHTMLAttributes<HTMLInputElement> & {
    label: string;
  };

// COMPONENTE

export default function FormInput({
  label,
  id,
  ...props
}: FormInputProps) {
  return (
    <div className="form-input">
      <label htmlFor={id}>
        {label}
      </label>

      <input
        id={id}
        {...props}
      />
    </div>
  );
}