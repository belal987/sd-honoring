import { describe, it, expect } from 'vitest';
import { classifyRank, classifyGender } from '../lib/rankUtils';


describe('Rank and Ceremony Date Classification', () => {
  // Test 7: First-place rank mapping to 29 October 2026
  it('maps first-place variations to Thursday, 29 October 2026', () => {
    const variants = ['الأولى', 'الاولى', 'الأول', 'الاول', 'المركز الأول', 'المركز الاول'];

    for (const variant of variants) {
      const result = classifyRank(variant);
      expect(result.normalizedRank).toBe('FIRST');
      expect(result.ceremonyDate).toBe('الخميس، 29 أكتوبر 2026');
      expect(result.isRankRecognized).toBe(true);
    }
  });

  // Test 8: Second-place rank mapping to 30 October 2026
  it('maps second-place variations to Friday, 30 October 2026', () => {
    const variants = ['الثانية', 'الثانيه', 'الثاني', 'الثانى', 'المركز الثاني', 'المركز الثانيه'];

    for (const variant of variants) {
      const result = classifyRank(variant);
      expect(result.normalizedRank).toBe('SECOND');
      expect(result.ceremonyDate).toBe('الجمعة، 30 أكتوبر 2026');
      expect(result.isRankRecognized).toBe(true);
    }
  });

  // Test 9: Unrecognized ranks not receiving an invented date
  it('does NOT invent dates for unrecognized or missing ranks', () => {
    const unknownRanks = ['الثالث', 'المركز الرابع', 'مشارك', '', undefined, 'امتياز'];

    for (const unknown of unknownRanks) {
      const result = classifyRank(unknown);
      expect(result.normalizedRank).toBe('UNRECOGNIZED');
      expect(result.ceremonyDate).toBeNull();
      expect(result.isRankRecognized).toBe(false);
    }
  });

  it('correctly maps gender variations to بنات or رجال', () => {
    expect(classifyGender('بنات').genderDisplay).toBe('بنات');
    expect(classifyGender('نساء').genderDisplay).toBe('بنات');
    expect(classifyGender('أولاد').genderDisplay).toBe('رجال');
    expect(classifyGender('رجال').genderDisplay).toBe('رجال');
  });
});
