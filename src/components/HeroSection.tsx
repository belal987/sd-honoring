import React from 'react';
import { Award, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#103D30] to-[#0B2A22] text-[#FFFEFA] py-8 sm:py-12 px-4 shadow-lg border-b-2 border-[#C7A85A]/30">
      {/* Decorative Subtle Background Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-islamic-pattern" />
      
      <div className="relative max-w-2xl mx-auto text-center flex flex-col items-center">
        {/* Event Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C7A85A]/15 border border-[#C7A85A]/40 text-[#FFFEFA] text-xs sm:text-sm font-medium mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#C7A85A]" />
          <span>حفل تكريم المتفوقين السنوي</span>
        </div>

        {/* Main Heading */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#FFFEFA] tracking-tight mb-3">
          كارت تكريمك <span className="gold-gradient-text">مستنيك</span>
        </h2>

        {/* Supporting Text */}
        <p className="text-sm sm:text-base text-[#F7F3E8]/90 max-w-lg leading-relaxed mb-1">
          ابحث عن اسمك واعثر على كارت التكريم الخاص بك، واحتفظ به على هاتفك لإبرازه يوم الاحتفال.
        </p>

        {/* Minimal Islamic Motif Divider */}
        <div className="flex items-center gap-2 mt-4 text-[#C7A85A]/60">
          <span className="w-12 h-[1px] bg-gradient-to-l from-[#C7A85A] to-transparent"></span>
          <Award className="w-4 h-4 text-[#C7A85A]" />
          <span className="w-12 h-[1px] bg-gradient-to-r from-[#C7A85A] to-transparent"></span>
        </div>
      </div>
    </section>
  );
};
