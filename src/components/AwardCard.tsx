import React, { useRef, useState, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Download, ArrowRight, Calendar, User, Hash, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import type { Student } from '../types/student';
import logoUrl from '../assets/logo.jpg';

interface AwardCardProps {
  student: Student;
  onReset: () => void;
}

export const AwardCard: React.FC<AwardCardProps> = ({ student, onReset }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current || isExporting) return;

    setIsExporting(true);
    setExportError(null);
    setExportSuccess(false);

    try {
      // Allow browser to settle fonts & rendering
      if (document.fonts) {
        await document.fonts.ready;
      }

      // Small tick for complete layout rendering
      await new Promise((resolve) => setTimeout(resolve, 150));

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        quality: 0.98,
        backgroundColor: '#0B2A22',
        filter: (node: HTMLElement) => {
          // Never export action buttons or external controls
          return !node.classList?.contains('no-export');
        },
      });

      const filename = `كارت-التكريم-رقم-${student.seatNumber || 'طالب'}.png`;

      // Trigger automatic download
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch (err) {
      console.error('Error exporting award card image:', err);
      // Fallback: generate a preview modal where user can long-press to save image
      try {
        if (cardRef.current) {
          const fallbackDataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
          setPreviewImage(fallbackDataUrl);
        }
      } catch (fallbackErr) {
        console.error('Fallback generation failed:', fallbackErr);
      }
      setExportError('تعذر تحميل الصورة تلقائيًا على جهازك. يمكنك الضغط المطوّل على الصورة لحفظها.');
    } finally {
      setIsExporting(false);
    }
  }, [student.seatNumber, isExporting]);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 flex flex-col items-center">
      {/* Top Navigation Action */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#103D30] hover:text-[#0B2A22] bg-[#FFFEFA] hover:bg-[#F7F3E8] border border-[#C7A85A]/40 px-3.5 py-2 rounded-xl transition-all shadow-sm focus:ring-2 focus:ring-[#103D30]"
        >
          <ArrowRight className="w-4 h-4 text-[#C7A85A]" />
          <span>بحث عن طالب آخر</span>
        </button>

        <span className="text-xs text-[#68736C]">
          جاهز للحفظ والطباعة
        </span>
      </div>

      {/* THE OFFICIAL AWARD CARD CONTAINER */}
      <div
        ref={cardRef}
        id="official-award-card"
        className="w-full max-w-[440px] bg-gradient-to-b from-[#0B2A22] via-[#103D30] to-[#081F19] text-[#FFFEFA] rounded-3xl p-6 sm:p-7 shadow-2xl border-4 border-[#C7A85A] relative overflow-hidden flex flex-col justify-between"
        style={{
          boxShadow: '0 20px 45px -15px rgba(11, 42, 34, 0.65), 0 0 25px rgba(199, 168, 90, 0.25)',
        }}
      >
        {/* Subtle Islamic Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-islamic-pattern" />

        {/* Inner Gold Filigree Corner Ornaments */}
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#C7A85A] rounded-tr-lg pointer-events-none" />
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#C7A85A] rounded-tl-lg pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#C7A85A] rounded-br-lg pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#C7A85A] rounded-bl-lg pointer-events-none" />

        {/* Card Header: School Emblem & Titles */}
        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#C7A85A] p-1 bg-[#FFFEFA] shadow-lg mb-2.5">
            <img
              src={logoUrl}
              alt="شعار مدرسة صلاح الدين"
              className="w-full h-full object-cover rounded-full"
              crossOrigin="anonymous"
            />
          </div>

          <h3 className="text-base sm:text-lg font-bold text-[#FFED99] tracking-normal mb-0.5 font-sans">
            مدرسة صلاح الدين للقرآن الكريم
          </h3>

          <div className="inline-block bg-gradient-to-r from-transparent via-[#C7A85A]/25 to-transparent px-4 py-0.5 rounded text-xs text-[#FFFEFA]/90 font-medium mb-2">
            الحفل السنوي لتكريم الدارسين 2025–2026
          </div>

          <div className="w-full flex items-center justify-center gap-2 my-1 text-[#C7A85A]">
            <span className="w-12 h-[1px] bg-gradient-to-l from-[#C7A85A] to-transparent"></span>
            <span className="text-xs uppercase tracking-widest font-bold px-1 text-[#C7A85A]">
              كارت التكريم
            </span>
            <span className="w-12 h-[1px] bg-gradient-to-r from-[#C7A85A] to-transparent"></span>
          </div>
        </div>

        {/* Student Name Block */}
        <div className="relative z-10 my-3.5 text-center">
          <span className="text-xs text-[#C7A85A]/80 font-medium block mb-1">
            يُمنح بكل فخر واعتزاز إلى
          </span>
          <div className="bg-[#FFFEFA]/10 border border-[#C7A85A]/40 rounded-2xl py-3 px-4 shadow-inner">
            <h2 className="text-xl sm:text-2xl font-black text-[#FFFEFA] leading-snug break-words">
              {student.name}
            </h2>
          </div>
        </div>

        {/* Student Info: Seat Number, Award Rank & Gender */}
        <div className="relative z-10 grid grid-cols-3 gap-2 my-2 text-center">
          {/* Seat Number */}
          <div className="bg-[#FFFEFA]/5 border border-[#C7A85A]/30 rounded-xl p-2 flex flex-col items-center justify-center">
            <span className="text-[11px] text-[#C7A85A] font-semibold flex items-center gap-1 mb-0.5">
              <Hash className="w-3 h-3" />
              رقم المقعد
            </span>
            <span className="text-base sm:text-lg font-bold text-[#FFFEFA]">
              {student.seatNumber || '—'}
            </span>
          </div>

          {/* Award Rank */}
          <div className="bg-gradient-to-b from-[#C7A85A]/25 to-[#C7A85A]/10 border border-[#C7A85A] rounded-xl p-2 flex flex-col items-center justify-center shadow-sm">
            <span className="text-[11px] text-[#FFED99] font-bold mb-0.5">
              المركز
            </span>
            <span className="text-sm sm:text-base font-extrabold text-[#FFFEFA] truncate w-full px-1">
              {student.rankDisplay}
            </span>
          </div>

          {/* Gender */}
          <div className="bg-[#FFFEFA]/5 border border-[#C7A85A]/30 rounded-xl p-2 flex flex-col items-center justify-center">
            <span className="text-[11px] text-[#C7A85A] font-semibold flex items-center gap-1 mb-0.5">
              <User className="w-3 h-3" />
              النوع
            </span>
            <span className="text-sm sm:text-base font-bold text-[#FFFEFA]">
              {student.genderDisplay}
            </span>
          </div>
        </div>

        {/* Ceremony Date Section */}
        <div className="relative z-10 my-2">
          <div className="bg-[#071914] border border-[#C7A85A]/60 rounded-xl p-3 text-center shadow-md">
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#C7A85A] font-bold mb-1">
              <Calendar className="w-3.5 h-3.5 text-[#C7A85A]" />
              <span>موعد حفل التكريم</span>
            </div>
            {student.isRankRecognized && student.ceremonyDate ? (
              <p className="text-base sm:text-lg font-extrabold text-[#FFED99]">
                {student.ceremonyDate}
              </p>
            ) : (
              <div className="text-xs text-amber-300 font-semibold flex items-center justify-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>يرجى مراجعة إدارة المدرسة لتحديد الموعد</span>
              </div>
            )}
          </div>
        </div>

        {/* Mandatory Ceremony Instructions Panel */}
        <div className="relative z-10 my-2.5 bg-[#FFFEFA]/5 border border-[#C7A85A]/30 rounded-xl p-3 text-right">
          <div className="text-xs font-bold text-[#C7A85A] mb-1.5 flex items-center gap-1">
            <span>✦</span>
            <span>تنبيهات مهمة</span>
          </div>
          <ol className="text-[11px] sm:text-xs text-[#F7F3E8]/90 space-y-1 pr-3 list-decimal leading-relaxed">
            <li>
              الحضور قبل الساعة 2:00 ظهرًا، ويُغلق الباب بعدها.
            </li>
            <li>
              القيد بالمدرسة وسداد الاشتراكات شرطان لاستلام الجائزة.
            </li>
            <li>
              أحضر كارت التكريم، والتزم بتعليمات المنظمين والأماكن المخصصة.
            </li>
          </ol>
        </div>

        {/* Card Footer: Closing Line & Signature */}
        <div className="relative z-10 mt-2 pt-2 border-t border-[#C7A85A]/30 text-center">
          <p className="text-[11px] sm:text-xs text-[#F7F3E8]/85 font-medium mb-1">
            مع تمنياتنا لجميع الدارسين بدوام التفوق والرقي
          </p>
          <div className="flex items-center justify-between text-[11px] text-[#C7A85A] font-bold px-2">
            <span>مدرسة صلاح الدين للقرآن الكريم</span>
            <span className="border-b border-[#C7A85A] pb-0.5">إدارة المدرسة</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Below The Card */}
      <div className="w-full max-w-[440px] mt-4 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={handleDownload}
          disabled={isExporting}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-[#C7A85A] to-[#B39343] hover:from-[#D8BB6D] hover:to-[#C7A85A] active:scale-[0.99] text-[#0B2A22] font-bold text-base rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border border-[#E2CD88] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#C7A85A]"
          aria-label="تحميل كارت التكريم كصورة عالية الجودة"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>جاري إعداد وتحميل الكارت...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>تحميل كارت التكريم</span>
            </>
          )}
        </button>

        {/* Status Messages */}
        {exportSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold p-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>تم تحميل كارت التكريم بنجاح على جهازك!</span>
          </div>
        )}

        {exportError && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold p-2.5 rounded-xl text-center flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{exportError}</span>
          </div>
        )}

        {/* Fallback Image Preview for iOS / Safari if auto-download is restricted */}
        {previewImage && (
          <div className="mt-2 bg-[#FFFEFA] border border-[#C7A85A] p-3 rounded-2xl text-center shadow-md">
            <p className="text-xs text-[#103D30] font-bold mb-2">
              اضغط مطولاً على الصورة أدناه لحفظها في ألبوم الصور:
            </p>
            <img
              src={previewImage}
              alt="كارت التكريم"
              className="w-full rounded-xl shadow border border-[#C7A85A]/40 mb-2"
            />
          </div>
        )}
      </div>
    </div>
  );
};
