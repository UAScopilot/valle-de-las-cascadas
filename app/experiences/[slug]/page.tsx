import { getExperienceBySlug } from '@/app/data/experiences'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata, ResolvingMetadata } from 'next'

// ✅ ¡NO declares interface ExperiencePageProps!

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const experience = getExperienceBySlug(params.slug)

  if (!experience) {
    return {
      title: 'Experiencia no encontrada',
      description: 'No pudimos encontrar la experiencia que buscabas.',
    }
  }

  return {
    title: experience.title,
    description: experience.location,
  }
}

export default async function ExperiencePage({ params }: Props) {
  const experience = getExperienceBySlug(params.slug)

  if (!experience) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50 text-gray-800" role="main">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-900 leading-tight mb-2">
            {experience.title}
          </h1>
          <p className="text-lg text-gray-600">{experience.location}</p>
        </header>

        <div className="relative w-full h-64 sm:h-96 md:h-[500px] mb-10 rounded-2xl overflow-hidden shadow-lg border border-blue-100">
          <Image
            src={experience.image}
            alt={`Imagen de ${experience.title}`}
            fill
            sizes="(max-width: 768px) 100vw, 700px"
            className="object-cover"
            priority
          />
        </div>

        <section className="prose prose-blue max-w-none text-lg leading-relaxed">
          <p>{experience.description}</p>
        </section>
      </article>
    </main>
  )
}
