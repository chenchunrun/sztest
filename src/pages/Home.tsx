import { useCallback, useEffect } from 'react';
import type { StudentInfo, VolunteerPlan } from '@/types';
import { useVolunteerPlan } from '@/hooks/useVolunteerPlan';
import { useLocalStorage } from '@/hooks/useLocalStorage';
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
  const [studentInfo, setStudentInfo] = useLocalStorage<StudentInfo | null>('sztest:lastStudentInfo', null);
  const [savedPlans, setSavedPlans] = useLocalStorage<VolunteerPlan[]>('sztest:savedPlans', []);
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

  const handleSavePlan = (p: VolunteerPlan) => {
    setSavedPlans(prev => {
      const filtered = prev.filter(x => x.generatedAt !== p.generatedAt);
      return [p, ...filtered].slice(0, 10);
    });
  };

  const handleLoadPlan = (p: VolunteerPlan) => {
    setStudentInfo(p.studentInfo);
    setTimeout(() => {
      document.getElementById('result')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDeletePlan = (generatedAt: string) => {
    setSavedPlans(prev => prev.filter(p => p.generatedAt !== generatedAt));
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
          <PlanResult
            plan={plan}
            onRegenerate={() => setStudentInfo(null)}
            onSavePlan={handleSavePlan}
            savedPlans={savedPlans}
            onLoadPlan={handleLoadPlan}
            onDeletePlan={handleDeletePlan}
          />
        </div>
      )}

      <SchoolLibrary />
      <TimelineSection />
      <RulesSection />
      <Footer />
    </div>
  );
}
