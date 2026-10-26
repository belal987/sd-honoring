import { describe, it, expect } from 'vitest';
import {
  normalizeArabic,
  normalizeDigits,
  normalizeSeatNumber,
  normalizeWithTaMarbutaFallback,
} from '../lib/arabicNormalization';

describe('Arabic Normalization Suite', () => {
  // Test 1: Arabic hamza normalization
  it('normalizes hamza variants (أ, إ, آ, ٱ) to plain alef (ا)', () => {
    expect(normalizeArabic('أحمد')).toBe('احمد');
    expect(normalizeArabic('إبراهيم')).toBe('ابراهيم');
    expect(normalizeArabic('آلاء')).toBe('الاء');
    expect(normalizeArabic('ٱسم')).toBe('اسم');
    expect(normalizeArabic('أحمد إسماعيل')).toBe('احمد اسماعيل');
  });

  // Test 2: Diacritic (tashkeel) and tatweel removal
  it('removes diacritics (tashkeel) and tatweel (ـ) accurately', () => {
    const withTashkeel = 'مُنَّةُ اللهِ مُؤْمِنٌ مُحَمَّد';
    expect(normalizeArabic(withTashkeel)).toBe('منة الله مؤمن محمد');

    const withTatweel = 'مـحـمـد سـالـم';
    expect(normalizeArabic(withTatweel)).toBe('محمد سالم');

    const mixed = 'أَحْـمَـدُ';
    expect(normalizeArabic(mixed)).toBe('احمد');
  });

  // Test 3: Whitespace and punctuation normalization
  it('normalizes whitespace and removes unwanted punctuation', () => {
    const spaced = '   سارة    أسامة   خلف   ';
    expect(normalizeArabic(spaced)).toBe('سارة اسامة خلف');

    const withPunctuation = 'فاطمة طه، فاروق؛ (بنات) - [1]!';
    expect(normalizeArabic(withPunctuation)).toBe('فاطمة طه فاروق بنات 1');
  });

  it('normalizes alef maksura (ى) to (ي) without changing ta marbuta (ة)', () => {
    expect(normalizeArabic('سندس نور فتحى')).toBe('سندس نور فتحي');
    expect(normalizeArabic('حبيبة')).toBe('حبيبة'); // 'ة' is preserved in base normalization
  });

  it('provides secondary ta marbuta fallback when needed', () => {
    expect(normalizeWithTaMarbutaFallback('فاطمة')).toBe('فاطمه');
  });

  it('converts Arabic-Indic digits to standard digits in seat numbers', () => {
    expect(normalizeDigits('١٢٣')).toBe('123');
    expect(normalizeSeatNumber('٥١٤')).toBe('514');
    expect(normalizeSeatNumber(42)).toBe('42');
  });
});
