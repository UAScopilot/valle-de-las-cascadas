'use client'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { useExperiences } from '@/app/contexts/ExperiencesContext'

interface Experience {
  product_id: string
  name: string
  description: string
  image: string
  price: number
  zone: string
  state: string
  slug: string
}

export default function ExperienceDetailPage({ params }: { params: { slug: string } }) {
  const { experiences, loading } = useExperiences()

  if (loading) {
    return <p className="p-4 text-gray-600">Cargando experiencia...</p>
  }

  const experience = experiences.find((exp) => exp.slug === params.slug)

  if (!experience) return notFound()

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{experience.name}</h1>
      <Image
        src={experience.image}
        alt={experience.name}
        width={800}
        height={400}
        className="rounded-xl w-full object-cover mb-4"
      />
      <p className="text-lg text-gray-700">{experience.description}</p>
      <p className="text-xl font-semibold mt-4">${experience.price}</p>
      <p className="text-sm text-gray-500 mt-2">{experience.zone}, {experience.state}</p>
    </div>
  )
}
