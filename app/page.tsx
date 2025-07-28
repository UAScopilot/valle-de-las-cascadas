'use client'

import { useState } from 'react'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import ExperienceCard from './components/ExperienceCard'
import { experiences } from './data/experiences'
import { useDebounce } from './hooks/useDebounce'

// ❌ Removemos esta parte:
// export const metadata = { ... }

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 300)

  const filteredExperiences = experiences.filter((exp) =>
    exp.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    exp.location.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100" role="main">
      <Navbar />
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      
      <section className="max-w-6xl mx-auto mt-12 px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-blue-900">
          Experiencias destacadas
        </h1>

        {filteredExperiences.length === 0 ? (
          <p className="text-gray-600 text-lg">No se encontraron experiencias para tu búsqueda.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 gap-y-8">
            {filteredExperiences.map((exp, index) => (
              <ExperienceCard
                key={index}
                title={exp.title}
                location={exp.location}
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
