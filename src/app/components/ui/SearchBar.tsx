import { InputHTMLAttributes, Ref } from "react";
import { Search } from "lucide-react";

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  inputRef?: Ref<HTMLInputElement>;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  inputRef,
  ...props
}) => {
  return (
    <div className="relative group">
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 transition-colors duration-200 group-focus-within:text-blue-600"
        size={18}
      />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2.5 bg-gray-950 border border-gray-900 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 transition-all duration-200 text-sm placeholder:text-gray-600"
        {...props}
      />
    </div>
  );
};
