import { useState, useRef } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SearchSection } from './components/SearchSection';
import { SearchResults } from './components/SearchResults';
import { AwardCard } from './components/AwardCard';
import { CeremonyInfo } from './components/CeremonyInfo';
import { Footer } from './components/Footer';
import { allStudents, dataValidation } from './lib/studentData';
import { useStudentSearch } from './hooks/useStudentSearch';
import type { Student } from './types/student';

export function App() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const cardSectionRef = useRef<HTMLDivElement>(null);
  const searchSectionRef = useRef<HTMLDivElement>(null);

  const {
    query,
    setQuery,
    clearQuery,
    results,
    hasQuery,
    isSearching,
  } = useStudentSearch(allStudents, { limit: 20 });

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setTimeout(() => {
      cardSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleReset = () => {
    setSelectedStudent(null);
    clearQuery();
    setTimeout(() => {
      searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F3E8] text-[#192720] font-sans antialiased selection:bg-[#C7A85A] selection:text-[#0B2A22]">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <HeroSection />

        {/* Live Search & Selection Flow */}
        {!selectedStudent ? (
          <div ref={searchSectionRef} className="pb-8">
            <SearchSection
              query={query}
              onQueryChange={setQuery}
              onClear={clearQuery}
              isSearching={isSearching}
              totalRecordsCount={dataValidation.totalLoaded}
            />

            {/* Screen Reader Announcement */}
            <div className="sr-only" aria-live="polite">
              {hasQuery && !isSearching
                ? `${results.length} نتائج بحث متاحة`
                : ''}
            </div>

            <SearchResults
              results={results}
              hasQuery={hasQuery}
              query={query}
              onSelectStudent={handleSelectStudent}
              onClearQuery={clearQuery}
            />
          </div>
        ) : (
          <div ref={cardSectionRef} className="py-6">
            <AwardCard student={selectedStudent} onReset={handleReset} />
          </div>
        )}

        {/* Informational Ceremony Schedule Section */}
        <CeremonyInfo />
      </main>

      {/* Minimal Footer */}
      <Footer />
    </div>
  );
}

export default App;
