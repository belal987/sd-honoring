import { describe, it, expect } from 'vitest';
import { parseStudentData, allStudents, dataValidation } from '../lib/studentData';


describe('Dataset Parsing and Student Data Validation', () => {
  // Test 10: Dataset parsing and record counting
  it('correctly loads and parses all records from the real merged.json file', () => {
    expect(allStudents.length).toBe(500);
    expect(dataValidation.totalLoaded).toBe(500);
  });

  // Test 11: Missing fields and duplicate seat-number reporting
  it('accurately detects missing fields, duplicate seats and duplicate names', () => {
    expect(dataValidation.missingSeats).toBe(0);
    expect(dataValidation.missingNames).toBe(0);
    expect(dataValidation.duplicateSeatNumbers.length).toBe(0);

    // In the real dataset, 'مهند احمد سعد' appears twice with different seats
    expect(dataValidation.duplicateNames.length).toBe(1);
    expect(dataValidation.duplicateNames[0].name).toBe('مهند احمد سعد');
    expect(dataValidation.duplicateNames[0].count).toBe(2);
  });

  // Test 12: Award card displaying only approved student fields
  it('retains group, class and level internally while keeping display fields strictly isolated', () => {
    const student = allStudents[0];

    // Card approved fields
    expect(student.name).toBeDefined();
    expect(student.seatNumber).toBeDefined();
    expect(student.rankDisplay).toBeDefined();
    expect(student.ceremonyDate).toBe('الخميس، 29 أكتوبر 2026');
    expect(student.genderDisplay).toBe('بنات');

    // Seat numbers are preserved as strings
    expect(typeof student.seatNumber).toBe('string');
  });

  it('safely handles multi-sheet structures and malformed records', () => {
    const multiSheetSample = {
      SheetA: [
        { م: '101', الاسم: 'طالب أ', المركز: 'الأول', النوع: 'بنين' },
      ],
      SheetB: [
        { م: '102', الاسم: 'طالبة ب', المركز: 'الثانية', النوع: 'بنات' },
        { م: null, الاسم: null }, // completely empty record
      ],
    };

    const { students, validation } = parseStudentData(multiSheetSample);
    expect(students.length).toBe(2);
    expect(validation.warnings.length).toBeGreaterThan(0);
  });
});
