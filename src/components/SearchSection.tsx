import React, { useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchSectionProps {
  query: string;
  onQueryChange: (val: string) => void;
  onClear: () => void;
  isSearching: boolean;
  totalRecordsCount: number;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  query,
  onQueryChange,
  onClear,
  isSearching,
  totalRecordsCount,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onClear();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <section className="w-full max-w-2xl mx-auto px-4 -mt-5 relative z-20">
      <div className="bg-[#FFFEFA] rounded-2xl shadow-xl border border-[#C7A85A]/30 p-5 sm:p-7">
        <div className="text-center mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-[#103D30] mb-1">
            ابحث عن اسمك
          </h3>
          <p className="text-xs sm:text-sm text-[#68736C]">
            اكتب اسمك أو رقم مقعدك للوصول إلى كارت التكريم.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative flex items-center">
          <div className="absolute right-4 text-[#103D30] pointer-events-none flex items-center justify-center">
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#C7A85A]" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="اكتب اسمك أو رقم المقعد..."
            dir="rtl"
            aria-label="ابحث بالاسم أو رقم المقعد"
            className="w-full pr-12 pl-11 py-3.5 sm:py-4 bg-[#F7F3E8]/60 hover:bg-[#F7F3E8] focus:bg-[#FFFEFA] text-[#192720] text-base sm:text-lg font-medium rounded-xl border border-[#C7A85A]/40 focus:border-[#103D30] focus:ring-2 focus:ring-[#103D30]/20 transition-all placeholder:text-[#68736C]/70 shadow-inner"
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="مسح البحث"
              className="absolute left-3 p-1.5 rounded-lg text-[#68736C] hover:text-[#103D30] hover:bg-[#C7A85A]/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C7A85A]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Helper Tip */}
        <div className="mt-3 flex items-center justify-between text-xs text-[#68736C] px-1">
          <span>مثال: «منة الله» أو «51»</span>
          <span className="font-medium text-[#103D30] bg-[#C7A85A]/15 px-2 py-0.5 rounded-full">
            {totalRecordsCount} مكرّم ومكرّمة
          </span>
        </div>
      </div>
    </section>
  );
};
