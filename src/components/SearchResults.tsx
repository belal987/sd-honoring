import React from 'react';
import type { Student } from '../types/student';
import { Award, ChevronLeft, UserCheck, AlertCircle } from 'lucide-react';

interface SearchResultsProps {
  results: Student[];
  hasQuery: boolean;
  query: string;
  onSelectStudent: (student: Student) => void;
  onClearQuery: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  hasQuery,
  query,
  onSelectStudent,
  onClearQuery,
}) => {
  if (!hasQuery) {
    return null;
  }

  // No results state
  if (results.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 mt-6">
        <div className="bg-[#FFFEFA] border border-amber-200 rounded-2xl p-6 text-center shadow-md">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-[#192720] mb-2">
            لم نعثر على نتيجة مطابقة
          </h4>
          <p className="text-sm text-[#68736C] leading-relaxed max-w-md mx-auto mb-4">
            لم نعثر على نتيجة مطابقة لـ «<span className="font-semibold text-[#103D30]">{query}</span>». جرّب كتابة الاسم بشكل مختلف أو ابحث برقم المقعد.
          </p>
          <button
            type="button"
            onClick={onClearQuery}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-[#103D30] bg-[#F7F3E8] hover:bg-[#C7A85A]/20 rounded-xl transition-colors border border-[#C7A85A]/40"
          >
            مسح وإعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mt-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs sm:text-sm font-semibold text-[#103D30]">
          نتائج البحث ({results.length} مكرّم)
        </span>
        <span className="text-xs text-[#68736C]">
          اضغط على اسمك لعرض كارت التكريم
        </span>
      </div>

      <div className="space-y-2.5">
        {results.map((student) => {
          return (
            <button
              key={student.id}
              type="button"
              onClick={() => onSelectStudent(student)}
              className="w-full text-right bg-[#FFFEFA] hover:bg-[#F7F3E8] active:bg-[#F0EBD9] border border-[#C7A85A]/30 hover:border-[#103D30] p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3 group focus:outline-none focus:ring-2 focus:ring-[#103D30]"
              aria-label={`اختيار كارت الطالب ${student.name}، مقعد رقم ${student.seatNumber}`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#103D30] text-[#C7A85A] flex-shrink-0 flex items-center justify-center font-bold text-sm shadow-inner group-hover:scale-105 transition-transform">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-base sm:text-lg font-bold text-[#192720] group-hover:text-[#103D30] truncate transition-colors">
                    {student.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                    <span className="bg-[#103D30]/10 text-[#103D30] font-semibold px-2 py-0.5 rounded-md">
                      مقعد: {student.seatNumber}
                    </span>
                    <span className="bg-[#C7A85A]/20 text-[#84661B] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Award className="w-3 h-3 text-[#C7A85A]" />
                      {student.rankDisplay}
                    </span>
                    <span className="text-[#68736C] bg-gray-100 px-2 py-0.5 rounded-md">
                      {student.genderDisplay}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 text-[#C7A85A] group-hover:text-[#103D30] group-hover:-translate-x-1 transition-all pl-1">
                <ChevronLeft className="w-5 h-5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
