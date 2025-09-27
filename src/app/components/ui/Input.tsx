import { InputHTMLAttributes, Ref } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
  inputRef?: Ref<HTMLInputElement>;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  className = "",
  inputRef,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-medium text-gray-500">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2.5 bg-black border border-gray-900 rounded-lg focus:outline-none focus:border-blue-600 text-sm transition-all duration-200 placeholder:text-gray-600 ${className}`}
        {...props}
      />
    </div>
  );
};
