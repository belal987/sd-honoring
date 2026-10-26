import React from 'react';
import logoUrl from '../assets/logo.jpg';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-[#0B2A22] border-b border-[#C7A85A]/30 text-[#FFFEFA] py-3.5 px-4 shadow-md sticky top-0 z-40 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* School Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#C7A85A] p-0.5 bg-[#FFFEFA] flex-shrink-0 shadow-inner">
            <img
              src={logoUrl}
              alt="شعار مدرسة صلاح الدين للقرآن الكريم"
              className="w-full h-full object-cover rounded-full"
              loading="eager"
            />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#FFFEFA] tracking-normal leading-tight font-sans">
              مدرسة صلاح الدين للقرآن الكريم
            </h1>
            <p className="text-xs sm:text-sm text-[#C7A85A] font-medium leading-tight mt-0.5">
              الحفل السنوي لتكريم الدارسين 2025–2026
            </p>
          </div>
        </div>

        {/* Small Year Badge */}
        <div className="hidden xs:flex items-center bg-[#103D30] border border-[#C7A85A]/40 px-2.5 py-1 rounded-full text-xs text-[#FFFEFA] font-medium shadow-sm">
          <span className="text-[#C7A85A] ml-1">✦</span>
          <span>دفعة التفوق</span>
        </div>
      </div>
    </header>
  );
};
