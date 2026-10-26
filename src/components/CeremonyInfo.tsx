import React from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { CEREMONY_DATES } from '../lib/rankUtils';

export const CeremonyInfo: React.FC = () => {
  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="bg-[#FFFEFA] rounded-2xl border border-[#C7A85A]/30 p-5 sm:p-7 shadow-md">
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#103D30]/10 text-[#103D30] text-xs font-bold mb-2">
            <Calendar className="w-3.5 h-3.5 text-[#103D30]" />
            <span>مواعيد الحفل السنوي</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#103D30]">
            جدول أيام تكريم المتفوقين 2025–2026
          </h3>
        </div>

        {/* Date Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
          {/* First Place Date */}
          <div className="bg-gradient-to-br from-[#103D30] to-[#0B2A22] text-[#FFFEFA] p-4 rounded-xl border border-[#C7A85A]/40 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#FFED99] bg-[#C7A85A]/25 px-2.5 py-0.5 rounded-full border border-[#C7A85A]/40">
                حفل المركز الأول
              </span>
              <span className="text-xs text-[#F7F3E8]/80 font-medium">الأول والأولى</span>
            </div>
            <p className="text-lg sm:text-xl font-black text-[#FFFEFA]">
              {CEREMONY_DATES.FIRST.date}
            </p>
          </div>

          {/* Second Place Date */}
          <div className="bg-gradient-to-br from-[#103D30] to-[#0B2A22] text-[#FFFEFA] p-4 rounded-xl border border-[#C7A85A]/40 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#FFED99] bg-[#C7A85A]/25 px-2.5 py-0.5 rounded-full border border-[#C7A85A]/40">
                حفل المركز الثاني
              </span>
              <span className="text-xs text-[#F7F3E8]/80 font-medium">الثاني والثانية</span>
            </div>
            <p className="text-lg sm:text-xl font-black text-[#FFFEFA]">
              {CEREMONY_DATES.SECOND.date}
            </p>
          </div>
        </div>

        {/* Important Notice Callouts */}
        <div className="space-y-2.5">
          <div className="bg-amber-50 border-r-4 border-amber-500 p-3.5 rounded-l-xl flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
              <span className="font-bold">تنبيه الحضور: </span>
              آخر موعد للحضور الساعة 2:00 ظهرًا، ويُغلق الباب بعدها.
            </div>
          </div>

          <div className="bg-emerald-50 border-r-4 border-emerald-600 p-3.5 rounded-l-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
              <span className="font-bold">شروط استلام الجائزة: </span>
              القيد بالمدرسة وسداد كامل الاشتراكات شرطان أساسيان لاستلام الجائزة والتكريم.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
