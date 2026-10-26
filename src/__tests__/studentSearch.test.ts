import { describe, it, expect } from 'vitest';
import { allStudents } from '../lib/studentData';
import { normalizeArabic, normalizeSeatNumber } from '../lib/arabicNormalization';

describe('Student Search Algorithm Verification', () => {
  // Test 4: Partial-name search and spelling variations
  it('matches partial names and handles hamza/tashkeel differences', () => {
    // Search for "منة" should match "منة الله مؤمن محمد"
    const query = normalizeArabic('منة');
    const matches = allStudents.filter((s) => s.normalizedName.includes(query));
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.some((s) => s.name.includes('منة الله'))).toBe(true);

    // Search with hamza variation: "اسراء" should match "إسراء ربيع بدوي"
    const queryHamza = normalizeArabic('اسراء');
    const matchesHamza = allStudents.filter((s) => s.normalizedName.includes(queryHamza));
    expect(matchesHamza.length).toBeGreaterThan(0);
    expect(matchesHamza.some((s) => s.name === 'إسراء ربيع بدوي')).toBe(true);
  });

  // Test 5: Exact seat-number search
  it('finds students by exact seat number and handles Arabic numerals', () => {
    const seatAscii = normalizeSeatNumber('1');
    const seatArabic = normalizeSeatNumber('١');

    expect(seatAscii).toBe('1');
    expect(seatArabic).toBe('1');

    const match = allStudents.find((s) => normalizeSeatNumber(s.seatNumber) === seatAscii);
    expect(match).toBeDefined();
    expect(match?.name).toBe('منة الله مؤمن محمد');
  });

  // Test 6: Duplicate-name handling
  it('returns both records for duplicate names and disambiguates by seat number', () => {
    const targetName = 'مهند احمد سعد';
    const normTarget = normalizeArabic(targetName);
    const duplicates = allStudents.filter((s) => s.normalizedName === normTarget);

    expect(duplicates.length).toBe(2);
    // Ensure both records have distinct seat numbers
    expect(duplicates[0].seatNumber).not.toBe(duplicates[1].seatNumber);
    expect(duplicates[0].id).not.toBe(duplicates[1].id);
  });
});
