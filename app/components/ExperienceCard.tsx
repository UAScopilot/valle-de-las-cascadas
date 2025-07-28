// app/components/ExperienceCard.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'

interface ExperienceCardProps {
  slug: string
  title: string
  location: string
  image: string
}

export default function ExperienceCard({ slug, title, location, image }: ExperienceCardProps) {
  return (
    <Link
      href={`/experiences/${slug}`}
      className="focus:outline-none focus:ring-2 rounded-xl"
    >
      <article
        className="rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105 bg-white"
        role="button"
        tabIndex={0}
        aria-label={`Ver experiencia: ${title}`}
      >
        <div className="relative w-full h-48 sm:h-56">
          <Image
            src={image}
            alt={`Imagen de la experiencia ${title}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 33vw"
            priority // Mejora LCP en imágenes que aparecen en el viewport inicial
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-blue-800">{title}</h3>
          <p className="text-sm text-gray-600">{location}</p>
        </div>
      </article>
    </Link>
  )
}
