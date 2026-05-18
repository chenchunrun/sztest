import { useState, useCallback, useEffect } from 'react';
import type { StudentInfo } from '@/types';
import { useVolunteerPlan } from '@/hooks/useVolunteerPlan';
import Navbar from '@/sections/Navbar';
import HeroSection from '@/sections/HeroSection';
import StepsSection from '@/sections/StepsSection';
import StudentForm from '@/sections/StudentForm';
import PlanResult from '@/sections/PlanResult';
import SchoolLibrary from '@/sections/SchoolLibrary';
import RulesSection from '@/sections/RulesSection';
import Footer from '@/sections/Footer';
import CountdownSection from '@/sections/CountdownSection';
import TimelineSection from '@/sections/TimelineSection';
import '../App.css';

function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer.observe(el);
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('animate-in');
      }
    });
    return () => observer.disconnect();
  }, []);
}

export default function Home() {
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const plan = useVolunteerPlan(studentInfo);
  useScrollAnimation();

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSubmit = (info: StudentInfo) => {
    setStudentInfo(info);
    setTimeout(() => {
      document.getElementById('result')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={scrollTo} />
      <HeroSection onStart={() => scrollTo('form')} />
      <CountdownSection />
      <StepsSection />
      <StudentForm onSubmit={handleSubmit} />

      {plan && (
        <div id="result">
          <PlanResult plan={plan} onRegenerate={() => setStudentInfo(null)} />
        </div>
      )}

      <SchoolLibrary />
      <TimelineSection />
      <RulesSection />
      <Footer />
    </div>
  );
}
