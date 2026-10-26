export type NormalizedRank = 'FIRST' | 'SECOND' | 'UNRECOGNIZED';

export type GenderDisplay = 'بنات' | 'رجال';

export interface RawStudentRecord {
  م?: string | number;
  الاسم?: string;
  مج?: string | number;
  الفرقة?: string;
  المستوى?: string;
  المركز?: string;
  النوع?: string;
  [key: string]: unknown;
}

export interface Student {
  id: string;
  seatNumber: string;
  name: string;
  normalizedName: string;
  groupNumber?: string;
  className?: string;
  level?: string;
  rawRank: string;
  normalizedRank: NormalizedRank;
  rankDisplay: string;
  rawGender: string;
  genderDisplay: GenderDisplay;
  ceremonyDate: string | null;
  ceremonyDay: string | null;
  attendanceTime?: string | null;
  isRankRecognized: boolean;
}

export interface ValidationReport {
  totalLoaded: number;
  missingSeats: number;
  missingNames: number;
  duplicateSeatNumbers: Array<{ seat: string; count: number }>;
  duplicateNames: Array<{ name: string; count: number }>;
  unrecognizedRanks: Array<{ rank: string; count: number }>;
  unrecognizedGenders: Array<{ gender: string; count: number }>;
  warnings: string[];
}
