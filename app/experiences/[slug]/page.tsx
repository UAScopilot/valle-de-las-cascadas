'use client'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { useExperiences } from '@/app/contexts/ExperiencesContext'
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Experience {
  product_id: string
  name: string
  description: string
  image: string
  price: number
  zone: string
  state: string
  slug: string
  attraction_cards?: Record<string, { reason: string }>
  expectation_images?: Record<string, { image: string }>
  expectations?: string
}

export default function ExperienceDetailPage({ params }: { params: { slug: string } }) {
  const { experiences, loading } = useExperiences()
  const [currentAttraction, setCurrentAttraction] = useState(0)
  const [currentExpectation, setCurrentExpectation] = useState(0)

  if (loading) {
    return <p className="p-4 text-gray-600">Cargando experiencia...</p>
  }

  const experience = experiences.find((exp) => exp.slug === params.slug) as Experience | undefined

  if (!experience) return notFound()

  const attractionCards = Object.values(experience.attraction_cards || {})
  const expectationImages = Object.values(experience.expectation_images || {})

  return (
    <div className="relative min-h-screen pb-20">
      {/* Imagen superior */}
      <div className="relative w-full h-64 sm:h-96">
        <Image
          src={experience.image}
          alt={experience.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">{experience.name}</h1>
        <p className="text-xl text-blue-700 font-semibold">${experience.price}</p>
        <p className="text-gray-700">{experience.description}</p>

        {/* Swiper de attraction_cards */}
        {attractionCards.length > 0 && (
          <div className="mt-6">
            <div className="relative bg-blue-50 p-4 rounded-xl shadow-md">
              <button
                onClick={() =>
                  setCurrentAttraction((prev) => (prev - 1 + attractionCards.length) % attractionCards.length)
                }
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-600"
                aria-label="Anterior"
              >
                <ChevronLeft size={28} />
              </button>
              <div className="text-center text-blue-900 font-medium text-lg">
                {attractionCards[currentAttraction].reason}
              </div>
              <button
                onClick={() =>
                  setCurrentAttraction((prev) => (prev + 1) % attractionCards.length)
                }
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600"
                aria-label="Siguiente"
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>
        )}

        {/* Expectation title */}
        <h2 className="text-2xl font-bold text-gray-800 mt-8">Lo que encontrarás</h2>

        {/* Swiper de expectation_images */}
        {expectationImages.length > 0 && (
          <div className="relative mt-4 h-56 rounded-xl overflow-hidden">
            <Image
              src={expectationImages[currentExpectation].image}
              alt={`expectation-${currentExpectation}`}
              fill
              className="object-cover"
            />
            <button
              onClick={() =>
                setCurrentExpectation((prev) =>
                  (prev - 1 + expectationImages.length) % expectationImages.length
                )
              }
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-1"
              aria-label="Anterior"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() =>
                setCurrentExpectation((prev) => (prev + 1) % expectationImages.length)
              }
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-1"
              aria-label="Siguiente"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        {/* Texto de expectations */}
        {experience.expectations && (
          <p className="mt-4 text-gray-700 leading-relaxed">{experience.expectations}</p>
        )}
      </div>

      {/* Botón fijo inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 flex justify-center z-50">
        <button className="bg-blue-600 text-white text-lg font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-all">
          Reservar Experiencia
        </button>
      </div>
    </div>
  )
}
