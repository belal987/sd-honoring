import rawMergedData from '../data/merged.json';
import type { RawStudentRecord, Student, ValidationReport } from '../types/student';
import { normalizeArabic, normalizeSeatNumber } from './arabicNormalization';
import { classifyRank, classifyGender } from './rankUtils';

/**
 * Normalizes a raw student record from the dataset
 */
function normalizeRecord(raw: RawStudentRecord, index: number, sheetKey: string): Student | null {
  if (!raw || typeof raw !== 'object') return null;

  const rawSeat = raw['م'] !== undefined && raw['م'] !== null ? String(raw['م']).trim() : '';
  const rawName = raw['الاسم'] ? String(raw['الاسم']).trim() : '';

  // If both seat and name are empty, record is completely invalid
  if (!rawSeat && !rawName) return null;

  const rawRank = raw['المركز'] ? String(raw['المركز']).trim() : '';
  const rawGender = raw['النوع'] ? String(raw['النوع']).trim() : '';
  const groupNumber = raw['مج'] !== undefined && raw['مج'] !== null ? String(raw['مج']).trim() : undefined;
  const className = raw['الفرقة'] ? String(raw['الفرقة']).trim() : undefined;
  const level = raw['المستوى'] ? String(raw['المستوى']).trim() : undefined;

  const { normalizedRank, rankDisplay, ceremonyDate, ceremonyDay, isRankRecognized } = classifyRank(rawRank);
  const { genderDisplay } = classifyGender(rawGender);

  return {
    id: `${sheetKey}-${rawSeat || 'no-seat'}-${index}`,
    seatNumber: rawSeat,
    name: rawName,
    normalizedName: normalizeArabic(rawName),
    groupNumber,
    className,
    level,
    rawRank,
    normalizedRank,
    rankDisplay: rankDisplay || 'المركز المستحق',
    rawGender,
    genderDisplay,
    ceremonyDate,
    ceremonyDay,
    isRankRecognized,
  };
}

/**
 * Parses the raw JSON file supporting multiple sheet keys or top-level array
 */
export function parseStudentData(rawData: unknown): {
  students: Student[];
  validation: ValidationReport;
} {
  const students: Student[] = [];
  const warnings: string[] = [];
  let missingSeats = 0;
  let missingNames = 0;

  const seatCounts = new Map<string, number>();
  const nameCounts = new Map<string, number>();
  const rankCounts = new Map<string, number>();
  const genderCounts = new Map<string, number>();

  if (!rawData || typeof rawData !== 'object') {
    warnings.push('ملف البيانات غير صالح أو فارغ.');
    return {
      students: [],
      validation: {
        totalLoaded: 0,
        missingSeats: 0,
        missingNames: 0,
        duplicateSeatNumbers: [],
        duplicateNames: [],
        unrecognizedRanks: [],
        unrecognizedGenders: [],
        warnings,
      },
    };
  }

  // Extract records across sheets or flat array
  const sheets: Record<string, RawStudentRecord[]> = Array.isArray(rawData)
    ? { default: rawData as RawStudentRecord[] }
    : (rawData as Record<string, RawStudentRecord[]>);

  let globalIndex = 0;
  for (const [sheetKey, records] of Object.entries(sheets)) {
    if (!Array.isArray(records)) continue;

    for (const record of records) {
      globalIndex++;
      const student = normalizeRecord(record, globalIndex, sheetKey);
      if (!student) {
        warnings.push(`تم تخطي سجل فارغ أو غير صالح في الورقة: ${sheetKey}، السجل رقم ${globalIndex}`);
        continue;
      }

      if (!student.seatNumber) {
        missingSeats++;
      } else {
        const normSeat = normalizeSeatNumber(student.seatNumber);
        seatCounts.set(normSeat, (seatCounts.get(normSeat) || 0) + 1);
      }

      if (!student.name) {
        missingNames++;
      } else {
        nameCounts.set(student.name, (nameCounts.get(student.name) || 0) + 1);
      }

      if (!student.isRankRecognized) {
        const rKey = student.rawRank || 'فارغ';
        rankCounts.set(rKey, (rankCounts.get(rKey) || 0) + 1);
      }

      const { isRecognized: isGenderRecognized } = classifyGender(student.rawGender);
      if (!isGenderRecognized) {
        const gKey = student.rawGender || 'فارغ';
        genderCounts.set(gKey, (genderCounts.get(gKey) || 0) + 1);
      }

      students.push(student);
    }
  }

  const duplicateSeatNumbers = [...seatCounts.entries()]
    .filter(([_, count]) => count > 1)
    .map(([seat, count]) => ({ seat, count }));

  const duplicateNames = [...nameCounts.entries()]
    .filter(([_, count]) => count > 1)
    .map(([name, count]) => ({ name, count }));

  const unrecognizedRanks = [...rankCounts.entries()].map(([rank, count]) => ({ rank, count }));
  const unrecognizedGenders = [...genderCounts.entries()].map(([gender, count]) => ({ gender, count }));

  const validation: ValidationReport = {
    totalLoaded: students.length,
    missingSeats,
    missingNames,
    duplicateSeatNumbers,
    duplicateNames,
    unrecognizedRanks,
    unrecognizedGenders,
    warnings,
  };

  return { students, validation };
}

// Global cached instance for production performance
export const { students: allStudents, validation: dataValidation } = parseStudentData(rawMergedData);

// Log validation details to console in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  console.group('📊 تقرير فحص بيانات مدرسة صلاح الدين للقرآن الكريم');
  console.log(`إجمالي السجلات المحملة: ${dataValidation.totalLoaded}`);
  console.log(`سجلات بدون رقم مقعد: ${dataValidation.missingSeats}`);
  console.log(`سجلات بدون اسم: ${dataValidation.missingNames}`);
  console.log(`أرقام مقاعد مكررة:`, dataValidation.duplicateSeatNumbers);
  console.log(`أسماء مكررة:`, dataValidation.duplicateNames);
  console.log(`مراكز غير معروفة:`, dataValidation.unrecognizedRanks);
  console.log(`أنواع غير معروفة:`, dataValidation.unrecognizedGenders);
  if (dataValidation.warnings.length) {
    console.warn(`تحذيرات:`, dataValidation.warnings);
  }
  console.groupEnd();
}
