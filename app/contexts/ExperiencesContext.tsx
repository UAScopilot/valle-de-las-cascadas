// app/contexts/ExperiencesContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
// Rutas corregidas: subimos dos niveles para llegar a 'lib'
import { getExperiences, Experience } from '../../lib/getExperiences';
import { getAllInfoDataFromFirebase, InfoItem } from '../../lib/getFirebaseInfo';

interface ExperiencesContextType {
  experiences: Experience[];
  allInfoData: Record<string, InfoItem>;
  loading: boolean;
  error: string | null;
}

const ExperiencesContext = createContext<ExperiencesContextType | undefined>(undefined);

export function ExperiencesProvider({ children }: { children: React.ReactNode }) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [allInfoData, setAllInfoData] = useState<Record<string, InfoItem>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [fetchedExperiences, fetchedInfoData] = await Promise.all([
          getExperiences(),
          getAllInfoDataFromFirebase(),
        ]);

        setExperiences(fetchedExperiences);
        setAllInfoData(fetchedInfoData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <ExperiencesContext.Provider value={{ experiences, allInfoData, loading, error }}>
      {children}
    </ExperiencesContext.Provider>
  );
}

export function useExperiences() {
  const context = useContext(ExperiencesContext);
  if (context === undefined) {
    throw new Error('useExperiences must be used within an ExperiencesProvider');
  }
  return context;
}