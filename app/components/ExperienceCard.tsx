// app/components/ExperienceCard.tsx

'use client'

import Image from 'next/image'

export interface ExperienceCardProps {
  name: string
  location: string
  image: string
  slug: string
}

export default function ExperienceCard({ name, location, image, slug }: ExperienceCardProps) {
  return (
    <div className="rounded-2xl shadow-md overflow-hidden bg-white hover:shadow-lg transition-all duration-300">
      <a href={`/experiences/${slug}`} className="block">
        <div className="relative w-full h-48">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
          <p className="text-gray-600 mt-1">{location}</p>
        </div>
      </a>
    </div>
  )
}
