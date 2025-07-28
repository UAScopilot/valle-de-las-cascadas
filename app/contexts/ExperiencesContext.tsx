'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { ref, get } from 'firebase/database'
import { db } from '@/lib/firebase'

export interface Experience {
  product_id: string
  name: string
  description: string
  image: string
  price: number
  zone: string
  state: string
  slug: string
}

interface ExperiencesContextValue {
  experiences: Experience[]
  loading: boolean
  error: string | null
}

const ExperiencesContext = createContext<ExperiencesContextValue>({
  experiences: [],
  loading: true,
  error: null,
})

export const ExperiencesProvider = ({ children }: { children: React.ReactNode }) => {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const dbRef = ref(db, 'projects/proj_rsK6jYGJzKf9mkbruz2oe6/data/experiences')
        const snapshot = await get(dbRef)

        if (!snapshot.exists()) {
          setExperiences([])
          setLoading(false)
          return
        }

        const rawData = snapshot.val()
        const data = Object.values(rawData) as Experience[]
        setExperiences(data)
      } catch (err: any) {
        console.error('Error al obtener experiencias:', err)
        setError(err.message || 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [])

  return (
    <ExperiencesContext.Provider value={{ experiences, loading, error }}>
      {children}
    </ExperiencesContext.Provider>
  )
}

export const useExperiences = () => useContext(ExperiencesContext)
