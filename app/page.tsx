'use client'

import { useState } from 'react'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import ExperienceCard from './components/ExperienceCard'
import { useDebounce } from './hooks/useDebounce'
import { useExperiences } from './contexts/ExperiencesContext' // 👈 Importar el hook del contexto

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 300)

  const { experiences, loading } = useExperiences() // 👈 Usamos los datos del contexto

  const filteredExperiences = experiences.filter((exp) =>
    exp.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    exp.zone.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100" role="main">
      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <section className="max-w-6xl mx-auto mt-12 px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-blue-900">
          Experiencias destacadas
        </h1>

        {loading ? (
          <p className="text-gray-600 text-lg">Cargando experiencias...</p>
        ) : filteredExperiences.length === 0 ? (
          <p className="text-gray-600 text-lg">No se encontraron experiencias para tu búsqueda.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 gap-y-8">
            {filteredExperiences.map((exp) => (
              <ExperienceCard
                key={exp.product_id}
                name={exp.name}
                location={`${exp.zone}, ${exp.state}`}
                image={exp.image}
                slug={exp.slug}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
