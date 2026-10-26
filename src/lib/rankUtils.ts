import type { NormalizedRank, GenderDisplay } from '../types/student';
import { normalizeArabic } from './arabicNormalization';

export const CEREMONY_DATES = {
  FIRST: {
    date: 'الخميس، 29 أكتوبر 2026',
    day: 'الخميس',
    formattedDate: '29 أكتوبر 2026',
    label: 'المركز الأول',
    attendanceTime: 'الساعة 3:00 عصرًا',
  },
  SECOND: {
    date: 'الجمعة، 30 أكتوبر 2026',
    day: 'الجمعة',
    formattedDate: '30 أكتوبر 2026',
    label: 'المركز الثاني',
    attendanceTime: 'الساعة 2:00 ظهرًا',
  },
} as const;

/**
 * Normalizes Arabic rank text and resolves the standardized ceremony date
 */
export function classifyRank(rawRank: string | undefined): {
  normalizedRank: NormalizedRank;
  rankDisplay: string;
  ceremonyDate: string | null;
  ceremonyDay: string | null;
  attendanceTime: string | null;
  isRankRecognized: boolean;
} {
  if (!rawRank) {
    return {
      normalizedRank: 'UNRECOGNIZED',
      rankDisplay: 'غير محدد',
      ceremonyDate: null,
      ceremonyDay: null,
      attendanceTime: null,
      isRankRecognized: false,
    };
  }

  // Normalize hamzas, alef maksura, diacritics and convert ة to ه for robust category classification
  const normalized = normalizeArabic(rawRank).replace(/ة/g, 'ه');

  // First place variations: الأول, الأولى, الاول, الاولى, المركز الاول, المركز الأولى, أولى
  if (normalized.includes('اول') || normalized.includes('الاول')) {
    return {
      normalizedRank: 'FIRST',
      rankDisplay: rawRank.trim(),
      ceremonyDate: CEREMONY_DATES.FIRST.date,
      ceremonyDay: CEREMONY_DATES.FIRST.day,
      attendanceTime: CEREMONY_DATES.FIRST.attendanceTime,
      isRankRecognized: true,
    };
  }

  // Second place variations: الثاني, الثانية, الثانيه, الثانى, المركز الثاني, المركز الثانيه
  if (normalized.includes('ثاني') || normalized.includes('الثاني')) {
    return {
      normalizedRank: 'SECOND',
      rankDisplay: rawRank.trim(),
      ceremonyDate: CEREMONY_DATES.SECOND.date,
      ceremonyDay: CEREMONY_DATES.SECOND.day,
      attendanceTime: CEREMONY_DATES.SECOND.attendanceTime,
      isRankRecognized: true,
    };
  }

  // Unrecognized rank (e.g. الثالث, مشارك, etc.): Do NOT guess date! Flag for review.
  return {
    normalizedRank: 'UNRECOGNIZED',
    rankDisplay: rawRank.trim(),
    ceremonyDate: null,
    ceremonyDay: null,
    attendanceTime: null,
    isRankRecognized: false,
  };
}

/**
 * Standardize gender display according to school specifications:
 * Shows 'بنات' or 'رجال' on the card.
 */
export function classifyGender(rawGender: string | undefined): {
  genderDisplay: GenderDisplay;
  isRecognized: boolean;
} {
  if (!rawGender) {
    return { genderDisplay: 'بنات', isRecognized: false };
  }

  const normalized = normalizeArabic(rawGender);

  if (normalized === 'بنات' || normalized === 'نساء' || normalized === 'بنت' || normalized === 'انثي') {
    return { genderDisplay: 'بنات', isRecognized: true };
  }

  if (normalized === 'رجال' || normalized === 'اولاد' || normalized === 'ولد' || normalized === 'ذكر') {
    return { genderDisplay: 'رجال', isRecognized: true };
  }

  // Fallback default
  return { genderDisplay: 'بنات', isRecognized: false };
}
