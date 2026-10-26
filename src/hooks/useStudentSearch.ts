import { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import type { Student } from '../types/student';
import { normalizeArabic, normalizeDigits, normalizeSeatNumber, normalizeWithTaMarbutaFallback } from '../lib/arabicNormalization';

export interface SearchOptions {
  limit?: number;
}

export function useStudentSearch(students: Student[], options: SearchOptions = {}) {
  const { limit = 20 } = options;
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce query to optimize input response on mobile
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 150);
    return () => clearTimeout(timer);
  }, [query]);

  // Pre-index seat numbers for O(1) instant exact lookup
  const seatMap = useMemo(() => {
    const map = new Map<string, Student[]>();
    for (const student of students) {
      const normSeat = normalizeSeatNumber(student.seatNumber);
      if (normSeat) {
        const existing = map.get(normSeat) || [];
        existing.push(student);
        map.set(normSeat, existing);
      }
    }
    return map;
  }, [students]);

  // Pre-configured Fuse.js index for fuzzy name search
  const fuse = useMemo(() => {
    return new Fuse(students, {
      keys: [
        { name: 'normalizedName', weight: 0.8 },
        { name: 'name', weight: 0.2 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [students]);

  // Filter and rank results
  const results = useMemo(() => {
    const rawTrimmed = debouncedQuery.trim();
    if (!rawTrimmed) {
      return [];
    }

    const normQuery = normalizeArabic(rawTrimmed);
    const digitQuery = normalizeDigits(rawTrimmed).replace(/\D/g, '');

    // 1. Check if the query is a seat number (or contains digits)
    if (digitQuery && seatMap.has(digitQuery)) {
      const exactSeatMatches = seatMap.get(digitQuery) || [];
      return exactSeatMatches;
    }

    if (!normQuery) {
      return [];
    }

    const matchedMap = new Map<string, { student: Student; score: number }>();

    // 2. Exact match or prefix/word match in normalized names
    const queryWords = normQuery.split(' ').filter(Boolean);

    for (const student of students) {
      const studentNorm = student.normalizedName;

      // Exact name match -> highest priority (score 100)
      if (studentNorm === normQuery) {
        matchedMap.set(student.id, { student, score: 100 });
        continue;
      }

      // Starts with query -> very high priority (score 80)
      if (studentNorm.startsWith(normQuery)) {
        matchedMap.set(student.id, { student, score: 80 });
        continue;
      }

      // Contains full normalized query phrase -> high priority (score 60)
      if (studentNorm.includes(normQuery)) {
        matchedMap.set(student.id, { student, score: 60 });
        continue;
      }

      // All words in query appear in student name (in any order) -> score 50
      if (queryWords.length > 1 && queryWords.every((word) => studentNorm.includes(word))) {
        matchedMap.set(student.id, { student, score: 50 });
        continue;
      }

      // Fallback: Ta Marbuta variation check
      const queryTa = normalizeWithTaMarbutaFallback(rawTrimmed);
      const studentTa = normalizeWithTaMarbutaFallback(student.name);
      if (studentTa.includes(queryTa)) {
        matchedMap.set(student.id, { student, score: 45 });
      }
    }

    // 3. If we don't have enough matches and query length is >= 2, run Fuse fuzzy search
    if (matchedMap.size < limit && normQuery.length >= 2) {
      const fuseResults = fuse.search(normQuery);
      for (const res of fuseResults) {
        if (!matchedMap.has(res.item.id)) {
          // Fuse score is 0 (best) to 1 (worst)
          const fuzzyScore = 40 - (res.score ?? 0.5) * 30;
          matchedMap.set(res.item.id, { student: res.item, score: fuzzyScore });
        }
        if (matchedMap.size >= limit * 2) break;
      }
    }

    // Sort by calculated score descending, then by seat number
    const sorted = [...matchedMap.values()]
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return Number(a.student.seatNumber || 0) - Number(b.student.seatNumber || 0);
      })
      .map((item) => item.student);

    return sorted.slice(0, limit);
  }, [debouncedQuery, students, seatMap, fuse, limit]);

  return {
    query,
    setQuery,
    clearQuery: () => setQuery(''),
    results,
    hasQuery: query.trim().length > 0,
    isSearching: query !== debouncedQuery,
  };
}
