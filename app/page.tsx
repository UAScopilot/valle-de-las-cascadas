// app/page.tsx
'use client'

import { useState } from 'react'
import SearchBar from './components/SearchBar'
import ExperienceCard from './components/ExperienceCard'
import { useDebounce } from './hooks/useDebounce'
import { useExperiences } from './contexts/ExperiencesContext'

// --- PALETA DE COLORES (DUPLICADA AQUÍ PARA CONSISTENCIA) ---
const primaryColor = 'teal';
const primaryColorShade = '700';
const backgroundColor = 'gray-50';
const cardBackgroundColor = 'white';
const mutedTextColor = 'gray-600';
const strongTextColor = 'gray-900';
const borderColor = 'gray-200';
// --- FIN PALETA DE COLORES ---

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 300)

  const { experiences, loading } = useExperiences()

  // ✨ CONSOLE.LOGS PARA DEPURACIÓN EN LA PÁGINA PRINCIPAL ✨
  if (!loading && experiences.length > 0) {
    console.log("--- DEBUG: app/page.tsx ---");
    console.log("Primera experiencia cargada (exp[0]):", experiences[0]);
    console.log("Todos los slugs disponibles en app/page.tsx:", experiences.map(exp => exp.slug));
    console.log("--------------------------");
  }
  // ✨ FIN CONSOLE.LOGS ✨

  const filteredExperiences = experiences.filter((exp) =>
    exp.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    exp.zone.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  return (
    <main className={`min-h-screen bg-${backgroundColor} pt-20`} role="main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-8">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
        <section className="mt-12 mb-16">
          <h1 className={`text-3xl sm:text-4xl font-bold mb-8 text-${strongTextColor}`}>
            Experiencias destacadas
          </h1>
          {loading ? (
            <p className={`text-${mutedTextColor} text-lg`}>Cargando experiencias...</p>
          ) : filteredExperiences.length === 0 ? (
            <p className={`text-${mutedTextColor} text-lg`}>No se encontraron experiencias para tu búsqueda.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 gap-y-8">
              {filteredExperiences.map((exp) => (
                <ExperienceCard
                  key={exp.product_id}
                  name={exp.name}
                  location={`${exp.zone}, ${exp.state}`}
                  image={exp.image}
                  slug={exp.slug}
                  price={exp.price}
                  duration={exp.duration}
                  duration_type={exp.duration_type}
                  category={exp.category}
                  includes_food={exp.includes_food}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
