import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0B2A22] text-[#FFFEFA] py-8 px-4 mt-12 border-t-2 border-[#C7A85A]/40 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-2">
        <h4 className="text-base sm:text-lg font-bold text-[#FFED99]">
          مدرسة صلاح الدين للقرآن الكريم
        </h4>
        <p className="text-xs sm:text-sm text-[#F7F3E8]/80 max-w-md leading-relaxed">
          مع تمنياتنا لجميع الدارسين بدوام التفوق والرقي
        </p>
        <div className="text-xs text-[#C7A85A] mt-2 pt-2 border-t border-[#C7A85A]/20">
          الحفل السنوي لتكريم الدارسين 2025–2026
        </div>
      </div>
    </footer>
  );
};
