import React from 'react';
import { Input as BaseInput } from './input';
import { Textarea as BaseTextarea } from './textarea';
import {
  Select as BaseSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { Label } from './label';
import { cn } from './utils';

// Input Wrapper
export interface InputProps extends React.ComponentProps<typeof BaseInput> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="space-y-2">
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <BaseInput
          id={inputId}
          ref={ref}
          className={cn(error && "border-red-500 focus-visible:ring-red-500", className)}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

// TextArea Wrapper (Note: Renamed to match the import 'TextArea' vs 'Textarea')
export interface TextAreaProps extends React.ComponentProps<typeof BaseTextarea> {
  label?: string;
  error?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="space-y-2">
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <BaseTextarea
          id={inputId}
          ref={ref}
          className={cn(error && "border-red-500 focus-visible:ring-red-500", className)}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
TextArea.displayName = "TextArea";

// Select Wrapper
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (e: { target: { name?: string; value: string } }) => void;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  required?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  name,
  disabled,
  className,
  error,
}) => {
  const handleValueChange = (newValue: string) => {
    if (onChange) {
      // Create a synthetic event to match the expected interface of the consumers
      onChange({
        target: {
          name,
          value: newValue,
        },
      });
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <BaseSelect
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger className={cn(error && "border-red-500 focus-visible:ring-red-500")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </BaseSelect>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
