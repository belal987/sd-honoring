/**
 * Arabic Text Normalization Utility
 * Designed specifically for high-accuracy search matching of Arabic names and seat numbers.
 */

// Arabic Diacritics (Tashkeel: Fathah, Dammah, Kasrah, Sukun, Tanween, Shaddah, Dagger Alif)
// and Quranic annotation signs
const DIACRITICS_REGEX = /[\u064B-\u0652\u0670\u06D6-\u06ED]/g;

// Arabic Tatweel (Kashida)
const TATWEEL_REGEX = /\u0640/g;

// Punctuation and symbols commonly found or typed
const PUNCTUATION_REGEX = /[،؛؟.,!?:;'"(){}\[\]<>—\-_/\\|*&#^%$#@~`+=]/g;

// Eastern Arabic Numerals (٠١٢٣٤٥٦٧٨٩) and Persian Numerals (۰۱۲۳۴۵۶۷۸۹)
const ARABIC_INDIC_DIGITS: Record<string, string> = {
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
  '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
  '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
  '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
};

const DIGITS_REGEX = /[٠-٩۰-۹]/g;

/**
 * Converts Eastern Arabic numerals to standard Western digits (0-9)
 */
export function normalizeDigits(input: string): string {
  if (!input) return '';
  return input.replace(DIGITS_REGEX, (char) => ARABIC_INDIC_DIGITS[char] ?? char);
}

/**
 * Base Arabic normalization for search indexing and comparison:
 * - Normalizes Unicode to NFC
 * - Removes diacritics / tashkeel and Quranic annotations
 * - Removes tatweel (ـ)
 * - Normalizes hamza variations (أ, إ, آ, ٱ) -> ا
 * - Normalizes alef maksura (ى) -> ي
 * - Removes punctuation
 * - Preserves 'ة' as 'ة' (does NOT replace with 'ه' to avoid false matches)
 * - Normalizes and collapses whitespace
 */
export function normalizeArabic(text: string): string {
  if (!text) return '';

  return (
    text
      // 1. Unicode NFC normalization
      .normalize('NFC')
      // 2. Remove tashkeel & Quranic marks
      .replace(DIACRITICS_REGEX, '')
      // 3. Remove tatweel
      .replace(TATWEEL_REGEX, '')
      // 4. Normalize hamzas on alef
      .replace(/[أإآٱ]/g, 'ا')
      // 5. Normalize alef maksura to yaa
      .replace(/ى/g, 'ي')
      // 6. Convert Arabic-Indic numerals if any
      .replace(DIGITS_REGEX, (char) => ARABIC_INDIC_DIGITS[char] ?? char)
      // 7. Remove punctuation
      .replace(PUNCTUATION_REGEX, ' ')
      // 8. Collapse whitespace and trim
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * Strict seat number normalizer (trims whitespace, converts Arabic digits to ASCII digits)
 */
export function normalizeSeatNumber(seat: string | number): string {
  if (seat === undefined || seat === null) return '';
  const str = String(seat).trim();
  return normalizeDigits(str);
}

/**
 * Flexible match for secondary fallback when user types 'ه' instead of 'ة' or vice-versa
 */
export function normalizeWithTaMarbutaFallback(text: string): string {
  return normalizeArabic(text).replace(/ة/g, 'ه');
}
