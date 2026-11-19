import React, { InputHTMLAttributes } from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

export const FormField = ({
  label,
  name,
  registration,
  error,
  ...inputProps
}: FormFieldProps) => {
  const errorId = `${name}-error`;

  return (
    <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column' }}>
      <label
        htmlFor={name}
        style={{ fontWeight: 600, marginBottom: '0.25rem' }}
      >
        {label}
      </label>
      <input
        id={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...registration}
        {...inputProps}
        style={{
          padding: '0.5rem',
          borderRadius: '4px',
          border: error ? '1px solid #dc2626' : '1px solid #cbd5e1',
        }}
      />
      {error && (
        <span
          id={errorId}
          role="alert"
          style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}
        >
          {error.message}
        </span>
      )}
    </div>
  );
};
