import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
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
    const revealVisibleElements = () => {
      document.querySelectorAll('.scroll-animate').forEach((element) => {
        if (!(element instanceof HTMLElement)) return;
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          element.classList.add('animate-in');
        }
      });
    };

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
    revealVisibleElements();

    const scheduleReveal = () => {
      requestAnimationFrame(() => {
        revealVisibleElements();
      });
    };

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          observeElement(node, observer);
          node.querySelectorAll?.('.scroll-animate').forEach((el) => observeElement(el, observer));
        });
      });
      scheduleReveal();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('hashchange', scheduleReveal);
    window.addEventListener('scroll', scheduleReveal, { passive: true });
    window.addEventListener('resize', scheduleReveal);
    window.setTimeout(scheduleReveal, 0);
    window.setTimeout(scheduleReveal, 180);

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('hashchange', scheduleReveal);
      window.removeEventListener('scroll', scheduleReveal);
      window.removeEventListener('resize', scheduleReveal);
    };
  }, []);
}

export default function Home() {
  const [draftDirty, setDraftDirty] = useState(false);
  const [storedStudentInfo, setStoredStudentInfo, clearStoredStudentInfo] = useLocalStorage<StudentInfo | null>(
    'sztest:lastStudentInfo',
    null,
    { ttlMs: PRIVATE_STORAGE_TTL_MS }
  );
  const [draftStudentInfo, setDraftStudentInfo] = useState<StudentInfo | null>(storedStudentInfo);
  const [submittedStudentInfo, setSubmittedStudentInfo] = useState<StudentInfo | null>(storedStudentInfo);
  const [formSyncKey, setFormSyncKey] = useState(0);
  const [savedPlans, setSavedPlans, clearSavedPlans] = useLocalStorage<VolunteerPlan[]>(
    'sztest:savedPlans',
    [],
    { ttlMs: PRIVATE_STORAGE_TTL_MS }
  );
  const { plan, isLoading } = useVolunteerPlan(submittedStudentInfo);
  useScrollAnimation();

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSubmit = (info: StudentInfo) => {
    setDraftDirty(false);
    setDraftStudentInfo(info);
    setStoredStudentInfo(info);
    setSubmittedStudentInfo(info);
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
    setDraftDirty(false);
    setDraftStudentInfo(p.studentInfo);
    setStoredStudentInfo(p.studentInfo);
    setSubmittedStudentInfo(p.studentInfo);
    setFormSyncKey((value) => value + 1);
    setTimeout(() => {
      document.getElementById('result')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDeletePlan = (generatedAt: string) => {
    setSavedPlans(prev => prev.filter(p => p.generatedAt !== generatedAt));
  };

  const handleClearStoredData = () => {
    setDraftDirty(false);
    setDraftStudentInfo(null);
    setSubmittedStudentInfo(null);
    clearStoredStudentInfo();
    clearSavedPlans();
    setFormSyncKey((value) => value + 1);
  };

  const handleRegenerate = () => {
    if (!draftStudentInfo) return;
    setDraftDirty(false);
    setSubmittedStudentInfo(draftStudentInfo);
    setTimeout(() => {
      document.getElementById('result')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const sectionFallback = <div className="px-4 py-12 text-center text-sm text-slate-400">正在加载内容...</div>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={scrollTo} />
      <HeroSection onStart={() => scrollTo('form')} />
      <CountdownSection />
      <StepsSection />
      <StudentForm
        key={formSyncKey}
        onSubmit={handleSubmit}
        initialValue={draftStudentInfo}
        onDirtyChange={setDraftDirty}
        onFormChange={setDraftStudentInfo}
      />

      {plan && draftDirty && !isLoading && (
        <div id="result" className="px-4 pt-8">
          <div className="max-w-4xl mx-auto rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            您已修改表单信息，当前下方显示的志愿方案仍基于上一次点击“生成志愿方案”时的条件。请重新生成，新的分数和偏好才会进入推荐结果。
          </div>
        </div>
      )}

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
              onRegenerate={handleRegenerate}
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
