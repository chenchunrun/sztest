import { lazy, Suspense, useCallback, useEffect } from 'react';
import type { StudentInfo, VolunteerPlan } from '@/types';
import { useVolunteerPlan } from '@/hooks/useVolunteerPlan';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import Navbar from '@/sections/Navbar';
import HeroSection from '@/sections/HeroSection';
import StepsSection from '@/sections/StepsSection';
import StudentForm from '@/sections/StudentForm';
import Footer from '@/sections/Footer';
import CountdownSection from '@/sections/CountdownSection';
import '../App.css';

const PRIVATE_STORAGE_TTL_MS = 24 * 60 * 60 * 1000;
const PlanResult = lazy(() => import('@/sections/PlanResult'));
const SchoolLibrary = lazy(() => import('@/sections/SchoolLibrary'));
const RulesSection = lazy(() => import('@/sections/RulesSection'));
const TimelineSection = lazy(() => import('@/sections/TimelineSection'));

function useScrollAnimation() {
  useEffect(() => {
    const observeElement = (element: Element, observer: IntersectionObserver) => {
      if (!(element instanceof HTMLElement)) return;
      if (!element.classList.contains('scroll-animate')) return;
      if (element.dataset.scrollObserved === 'true') return;

      element.dataset.scrollObserved = 'true';
      observer.observe(element);

      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        element.classList.add('animate-in');
      }
    };

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
      observeElement(el, observer);
    });

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          observeElement(node, observer);
          node.querySelectorAll?.('.scroll-animate').forEach((el) => observeElement(el, observer));
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}

export default function Home() {
  const [studentInfo, setStudentInfo, clearStudentInfo] = useLocalStorage<StudentInfo | null>(
    'sztest:lastStudentInfo',
    null,
    { ttlMs: PRIVATE_STORAGE_TTL_MS }
  );
  const [savedPlans, setSavedPlans, clearSavedPlans] = useLocalStorage<VolunteerPlan[]>(
    'sztest:savedPlans',
    [],
    { ttlMs: PRIVATE_STORAGE_TTL_MS }
  );
  const { plan, isLoading } = useVolunteerPlan(studentInfo);
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

  const handleClearStoredData = () => {
    clearStudentInfo();
    clearSavedPlans();
  };

  const sectionFallback = <div className="px-4 py-12 text-center text-sm text-slate-400">正在加载内容...</div>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={scrollTo} />
      <HeroSection onStart={() => scrollTo('form')} />
      <CountdownSection />
      <StepsSection />
      <StudentForm onSubmit={handleSubmit} />

      {isLoading && (
        <div id="result" className="px-4 py-12 text-center text-sm text-slate-400">
          正在生成志愿方案...
        </div>
      )}

      {plan && !isLoading && (
        <div id="result">
          <Suspense fallback={sectionFallback}>
            <PlanResult
              plan={plan}
              onRegenerate={() => setStudentInfo(null)}
              onSavePlan={handleSavePlan}
              savedPlans={savedPlans}
              onLoadPlan={handleLoadPlan}
              onDeletePlan={handleDeletePlan}
              onClearStoredData={handleClearStoredData}
            />
          </Suspense>
        </div>
      )}

      <Suspense fallback={sectionFallback}>
        <SchoolLibrary />
      </Suspense>
      <Suspense fallback={sectionFallback}>
        <TimelineSection />
      </Suspense>
      <Suspense fallback={sectionFallback}>
        <RulesSection />
      </Suspense>
      <Footer />
    </div>
  );
}
