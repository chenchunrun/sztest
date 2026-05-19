import { useEffect, useState } from 'react';
import type { StudentInfo, VolunteerPlan } from '@/types';

export function useVolunteerPlan(studentInfo: StudentInfo | null) {
  const [plan, setPlan] = useState<VolunteerPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!studentInfo) {
      setPlan(null);
      setIsLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setIsLoading(true);

    import('@/lib/volunteerPlanEngine')
      .then(({ generateVolunteerPlan }) => {
        if (cancelled) return;
        setPlan(generateVolunteerPlan(studentInfo));
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setPlan(null);
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [studentInfo]);

  return { plan, isLoading };
}
