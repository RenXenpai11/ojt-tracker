import { useState, useRef, useEffect } from "react";
import { School, ChevronDown } from "lucide-react";
import { SCHOOL_LOGOS } from "../data/schools";

interface SearchableSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

const SCHOOL_LOGO_COLORS = [
  "bg-orange-100 text-orange-700 border-orange-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-rose-100 text-rose-700 border-rose-200",
  "bg-indigo-100 text-indigo-700 border-indigo-200",
];

function extractSchoolBadgeText(schoolName: string): string {
  const acronymInParenthesis = schoolName.match(/\(([^)]+)\)/);
  if (acronymInParenthesis?.[1]) {
    return acronymInParenthesis[1].replace(/\s+/g, " ").trim().slice(0, 6).toUpperCase();
  }

  const ignoredWords = new Set(["of", "the", "and", "for", "at", "in"]);
  const tokens = schoolName
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => !ignoredWords.has(word.toLowerCase()));

  if (tokens.length === 0) return "SCH";
  if (tokens.length === 1) return tokens[0].slice(0, 3).toUpperCase();

  return tokens
    .slice(0, 4)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getSchoolBadgeColor(schoolName: string): string {
  const hash = schoolName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return SCHOOL_LOGO_COLORS[hash % SCHOOL_LOGO_COLORS.length];
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Search and select...",
  label,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [brokenLogos, setBrokenLogos] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search query
  const filteredOptions = searchQuery.trim()
    ? options.filter(option =>
        option.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  function handleSelect(option: string) {
    onChange(option);
    setIsOpen(false);
    setSearchQuery("");
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
    if (!isOpen) setIsOpen(true);
  }

  function handleInputFocus() {
    setIsOpen(true);
  }

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="text-slate-700 text-sm font-semibold mb-2.5 block">
          {label}
        </label>
      )}

      <div className="relative group">
        <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600 group-focus-within:text-orange-600 transition-colors duration-300 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={isOpen && searchQuery ? searchQuery : value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white/60 border border-amber-200/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:bg-white transition-all duration-300"
        />
        <ChevronDown
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600 pointer-events-none transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-amber-200/50 rounded-2xl shadow-lg z-50 max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            <ul className="py-2">
              {filteredOptions.map((option, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left px-4 py-2.5 hover:bg-amber-50/50 transition-colors duration-150 flex items-center gap-3 ${
                      value === option
                        ? "bg-orange-50/70 text-orange-700 font-medium"
                        : "text-slate-700"
                    }`}
                  >
                    {SCHOOL_LOGOS[option] && !brokenLogos[option] ? (
                      <img
                        src={SCHOOL_LOGOS[option]}
                        alt={`${option} logo`}
                        className="h-7 w-7 rounded-md border border-amber-200 bg-white object-contain p-1"
                        loading="lazy"
                        onError={() =>
                          setBrokenLogos((prev) => ({ ...prev, [option]: true }))
                        }
                      />
                    ) : (
                      <span
                        className={`inline-flex h-7 min-w-7 px-1 rounded-md border items-center justify-center text-[10px] font-bold tracking-wide ${getSchoolBadgeColor(option)}`}
                      >
                        {extractSchoolBadgeText(option)}
                      </span>
                    )}
                    <span className="text-sm leading-tight">{option}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center text-slate-500 text-sm">
              No schools found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
